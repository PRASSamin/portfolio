/*
Copyright © 2025 PRAS
*/
package cmd

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	survey "github.com/AlecAivazis/survey/v2"
	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
	"gopkg.in/yaml.v3"
)

// blogEditCmd represents the blogEdit command
var blogEditCmd = &cobra.Command{
	Use:   "edit",
	Short: "Edit a blog post",
	Run: func(cmd *cobra.Command, args []string) {
		godotenv.Load()

		blogDir, err := getContentDir("blog")
		if err != nil {
			fmt.Println(err)
			return
		}

		blogs, err := listContentFiles(blogDir)
		if err != nil {
			fmt.Println(err)
			return
		}

		var selectedBlog string
		prompt := &survey.Select{
			Message: "Select a blog to edit:",
			Options: blogs,
		}
		if err := survey.AskOne(prompt, &selectedBlog); err != nil {
			fmt.Println("Selection error:", err)
			return
		}

		filePath := filepath.Join(blogDir, selectedBlog)
		frontmatter, body, err := readFrontmatter(filePath)
		if err != nil {
			fmt.Println("Error reading frontmatter:", err)
			return
		}

		// Get current tags for default value
		var currentTags []string
		if tags, ok := frontmatter["tags"].([]any); ok {
			for _, t := range tags {
				if tag, ok := t.(string); ok {
					currentTags = append(currentTags, tag)
				}
			}
		}

		answers := BlogAnswers{}
		qs := []*survey.Question{
			{
				Name: "title",
				Prompt: &survey.Input{
					Message: "Blog title:",
					Default: getStringFromMap(frontmatter, "title", ""),
				},
				Validate: survey.Required,
			},
			{
				Name: "description",
				Prompt: &survey.Input{
					Message: "Blog description:",
					Default: getStringFromMap(frontmatter, "description", ""),
				},
			},
		}

		if err := survey.Ask(qs, &answers); err != nil {
			fmt.Println(err)
			return
		}

		// Interactive tag management (seed with existing)
		tags, err := editTags(currentTags)
		if err != nil {
			fmt.Println("Tag editing cancelled or failed:", err)
			return
		}

		// Thumbnail
		updateThumbnail := false
		confirm := &survey.Confirm{
			Message: "Do you want to update the thumbnail?",
		}
		if err := survey.AskOne(confirm, &updateThumbnail); err != nil {
			fmt.Println("Thumbnail prompt error:", err)
			return
		}

		if updateThumbnail {
			thumbnail := cmd.Flag("thumbnail").Value.String()
			if thumbnail == "" {
				file, err := askFile(".")
				if err != nil {
					fmt.Println(err)
					return
				}

				resp, err := uploadImage(file, answers.Title, "blogs")
				if err != nil {
					fmt.Println("Error uploading image:", err)
					return
				}
				answers.Thumbnail = resp.SecureURL
			} else {
				answers.Thumbnail = thumbnail
			}
		} else {
			answers.Thumbnail = getStringFromMap(frontmatter, "thumbnail", "")
		}

		// Update frontmatter
		frontmatter["title"] = answers.Title
		frontmatter["description"] = answers.Description
		frontmatter["thumbnail"] = answers.Thumbnail
		if len(tags) > 0 {
			frontmatter["tags"] = tags
		} else {
			// clear tags if user removed all
			delete(frontmatter, "tags")
		}
		frontmatter["updatedAt"] = time.Now().Format(time.RFC3339)

		// Write back to file
		ym, err := yaml.Marshal(frontmatter)
		if err != nil {
			fmt.Println("Error marshalling frontmatter:", err)
			return
		}

		mdx := strings.Builder{}
		mdx.WriteString("---")
		mdx.Write(ym)
		mdx.WriteString("---")
		mdx.WriteString(body)

		if err := os.WriteFile(filePath, []byte(mdx.String()), 0o644); err != nil {
			fmt.Println("Error writing mdx file:", err)
			return
		}

		fmt.Printf("Successfully updated blog post '%s'\n", answers.Title)
	},
}

func init() {
	blogEditCmd.Flags().StringP("thumbnail", "t", "", "Thumbnail url")
	blogCmd.AddCommand(blogEditCmd)
}