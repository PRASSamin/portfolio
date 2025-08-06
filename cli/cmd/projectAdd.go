/*
Copyright 2025 PRAS
*/
package cmd

import (
	"fmt"
	"strings"
	"time"

	"github.com/AlecAivazis/survey/v2"
	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
)

func init() {
	addCmd.Flags().StringP("thumbnail", "t", "", "Thumbnail url")
	projectsCmd.AddCommand(addCmd)
}

type Answers struct {
	Slug        string   `survey:"slug"`
	Title       string   `survey:"title"`
	Description string   `survey:"description"`
	Github      string   `survey:"github"`
	Live        string   `survey:"live"`
	Category    string   `survey:"category"`
	Tools       []string `survey:"tools"`
	Thumbnail   string   `survey:"thumbnail"`
}

// addCmd represents the add command
var addCmd = &cobra.Command{
	Use:   "add",
	Short: "Add a project",
	Run: func(cmd *cobra.Command, args []string) {
		godotenv.Load()
		tools, err := loadTools("public/icons/data.yaml")
		if err != nil {
			fmt.Println(err)
			return
		}

		projectDir, err := getContentDir("project")
		if err != nil {
			fmt.Println(err)
			return
		}


qs := []*survey.Question{
	{
		Name:     "slug",
		Prompt:   &survey.Input{Message: "Project slug:"},
		Validate: survey.ComposeValidators(survey.Required, func(ans interface{}) error {
			projects, _ := listContentFiles(projectDir)
			if projects == nil {
				return nil
			}
			for _, project := range projects {
				if strings.TrimSuffix(project, ".mdx") == ans.(string) {
					return fmt.Errorf("project with slug %s already exists", ans)
				}
			}
			return nil
		}),
	},
	{
		Name:     "title",
		Prompt:   &survey.Input{Message: "Project title:"},
		Validate: survey.Required,
	},
	{
		Name:   "description",
		Prompt: &survey.Input{Message: "Project description:"},
	},
	{
		Name:   "github",
		Prompt: &survey.Input{Message: "Github link:"},
	},
	{
		Name:   "live",
		Prompt: &survey.Input{Message: "Live link:"},
	},
	{
		Name:     "category",
		Prompt: &survey.Input{Message: "Category:"},
		Validate: survey.Required,
	},
}

		var answers Answers

		err = survey.Ask(qs, &answers)
		if err != nil {
			fmt.Println(err)
			return
		}

		thumbnail := cmd.Flag("thumbnail").Value.String()
		if thumbnail == "" {
			// Get the image file path
			file, err := askFile(".")
			if err != nil {
				fmt.Println(err)
				return
			}

			// Upload the selected image
			resp, err := uploadImage(file, answers.Title, "projects")
			if err != nil {
				fmt.Println("Error uploading image:", err)
				return
			}

			answers.Thumbnail = resp.SecureURL
		} else {
			answers.Thumbnail = thumbnail
		}

		toolPrompt := &survey.MultiSelect{
			Message:  "Select tools:",
			Options:  tools,
			PageSize: 15,
		}

		err = survey.AskOne(toolPrompt, &answers.Tools, survey.WithValidator(survey.Required))
		if err != nil {
			fmt.Println(err)
			return
		}

		// Build frontmatter
		frontmatter := make(map[string]any)
		if answers.Title != "" {
			frontmatter["title"] = answers.Title
		}
		if answers.Description != "" {
			frontmatter["description"] = answers.Description
		}
		if answers.Thumbnail != "" {
			frontmatter["thumbnail"] = answers.Thumbnail
		}
		links := make(map[string]string)
		if answers.Github != "" {
			links["github"] = answers.Github
		}
		if answers.Live != "" {
			links["live"] = answers.Live
		}
		if len(links) > 0 {
			frontmatter["links"] = links
		}
		if answers.Category != "" {
			frontmatter["category"] = answers.Category
		}
		if len(answers.Tools) > 0 {
			frontmatter["tools"] = answers.Tools
		}
		frontmatter["createdAt"] = time.Now().Format(time.RFC3339)
		frontmatter["updatedAt"] = time.Now().Format(time.RFC3339)

		err = writeProjectMDX(frontmatter, answers.Slug, projectDir, answers.Title, answers.Description)
		if err != nil {
			fmt.Println("Error writing MDX file:", err)
			return
		}

		fmt.Printf("Successfully created project '%s' in %s/%s.mdx\n", answers.Title, projectDir, answers.Slug)
	},
}
