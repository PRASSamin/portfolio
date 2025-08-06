package cmd

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/AlecAivazis/survey/v2"
	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
	"gopkg.in/yaml.v3"
)

func init() {
	editCmd.Flags().StringP("thumbnail", "t", "", "Thumbnail url")
	projectsCmd.AddCommand(editCmd)
}

// editCmd represents the edit command
var editCmd = &cobra.Command{
	Use:   "edit",
	Short: "Edit a project",
	Run: func(cmd *cobra.Command, args []string) {
		godotenv.Load()

		projectDir, err := getContentDir("project")
		if err != nil {
			fmt.Println(err)
			return
		}

		// Tools
		tools, err := loadTools("public/icons/data.yaml")
		if err != nil {
			fmt.Println(err)
			return
		}

		projects, err := listContentFiles(projectDir)
		if err != nil {
			fmt.Println(err)
			return
		}

		var selectedProject string
		prompt := &survey.Select{
			Message: "Select a project to edit:",
			Options: projects,
		}
		survey.AskOne(prompt, &selectedProject)

		filePath := filepath.Join(projectDir, selectedProject)
		frontmatter, body, err := readFrontmatter(filePath)
		if err != nil {
			fmt.Println("Error reading frontmatter:", err)
			return
		}

		answers := Answers{}
		qs := []*survey.Question{
			{
				Name:     "title",
				Prompt:   &survey.Input{
					Message: "Project title:",
					Default: getStringFromMap(frontmatter, "title", ""),
				},
				Validate: survey.Required,
			},
			{
				Name:   "description",
				Prompt: &survey.Input{
					Message: "Project description:",
					Default: getStringFromMap(frontmatter, "description", ""),
				},
			},
			{
				Name:   "github",
				Prompt: &survey.Input{
					Message: "Github link:",
					Default: getStringFromNestedMap(frontmatter, "links", "github", ""),
				},
			},
			{
				Name:   "live",
				Prompt: &survey.Input{
					Message: "Live link:",
					Default: getStringFromNestedMap(frontmatter, "links", "live", ""),
				},
			},
			{
				Name:     "category",
				Prompt:   &survey.Input{
					Message: "Category:",
					Default: getStringFromMap(frontmatter, "category", ""),
				},
				Validate: survey.Required,
			},
		}

		err = survey.Ask(qs, &answers)
		if err != nil {
			fmt.Println(err)
			return
		}

		// Thumbnail
		updateThumbnail := false
		confirm := &survey.Confirm{
			Message: "Do you want to update the thumbnail?",
		}
		survey.AskOne(confirm, &updateThumbnail)

		if updateThumbnail {
			thumbnail := cmd.Flag("thumbnail").Value.String()
			if thumbnail == "" {
				file, err := askFile(".")
				if err != nil {
					fmt.Println(err)
					return
				}

				resp, err := uploadImage(file, answers.Title, "projects")
				if err != nil {
					fmt.Println("Error uploading image:", err)
					return
				}
				answers.Thumbnail = resp.SecureURL
			} else {
				answers.Thumbnail = thumbnail
			}
		} else {
			answers.Thumbnail = frontmatter["thumbnail"].(string)
		}

		// For the tools default value
		var defaultTools []string
		if tools, ok := frontmatter["tools"].([]any); ok {
			for _, t := range tools {
				if tool, ok := t.(string); ok {
					defaultTools = append(defaultTools, tool)
				}
			}
		}

		toolPrompt := &survey.MultiSelect{
			Message:  "Select tools:",
			Options:  tools,
			Default:  defaultTools,
			PageSize: 15,
		}

		err = survey.AskOne(toolPrompt, &answers.Tools, survey.WithValidator(survey.Required))
		if err != nil {
			fmt.Println(err)
			return
		}

		// Update frontmatter
		if answers.Title != "" {
			frontmatter["title"] = answers.Title
		}
		if answers.Description != "" {
			frontmatter["description"] = answers.Description
		}
		if answers.Thumbnail != "" {
			frontmatter["thumbnail"] = answers.Thumbnail
		}
		if links, ok := frontmatter["links"].(map[string]any); ok {
			if answers.Github != "" {
				links["github"] = answers.Github
			}
			if answers.Live != "" {
				links["live"] = answers.Live
			}
		}
		if answers.Category != "" {
			frontmatter["category"] = answers.Category
		}
		if len(answers.Tools) > 0 {
			frontmatter["tools"] = answers.Tools
		}

		// Write back to file
		ym, err := yaml.Marshal(frontmatter)
		if err != nil {
			fmt.Println("Error marshalling frontmatter:", err)
			return
		}

		mdx := strings.Builder{}
		mdx.WriteString("---\n")
		mdx.Write(ym)
		mdx.WriteString("---\n")
		mdx.WriteString(body)

		if err := os.WriteFile(filePath, []byte(mdx.String()), 0o644); err != nil {
			fmt.Println("Error writing mdx file:", err)
			return
		}

		fmt.Printf("Successfully updated project '%s'\n", answers.Title)
	},
}
