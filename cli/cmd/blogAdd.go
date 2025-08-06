/*
Copyright © 2025 PRAS
*/
package cmd

import (
	"fmt"
	"strings"
	"time"

	survey "github.com/AlecAivazis/survey/v2"
	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
)

func init() {
	blogAddCmd.Flags().StringP("thumbnail", "t", "", "Thumbnail url")
	blogCmd.AddCommand(blogAddCmd)
}

// BlogAnswers defines the survey answers for a new blog post.
type BlogAnswers struct {
	Slug        string `survey:"slug"`
	Title       string `survey:"title"`
	Description string `survey:"description"`
	Thumbnail   string `survey:"thumbnail"`
}

// blogAddCmd represents the blogAdd command
var blogAddCmd = &cobra.Command{
	Use:   "add",
	Short: "Add a blog post",
	Run: func(cmd *cobra.Command, args []string) {
		godotenv.Load()

		blogDir, err := getContentDir("blog")
		if err != nil {
			fmt.Println(err)
			return
		}

		qs := []*survey.Question{
			{
				Name:     "slug",
				Prompt:   &survey.Input{Message: "Blog slug:"},
				Validate: survey.ComposeValidators(survey.Required, func(ans interface{}) error {
					blogs, _ := listContentFiles(blogDir)
					if blogs == nil {
						return nil
					}
					for _, blog := range blogs {
						if strings.TrimSuffix(blog, ".mdx") == ans.(string) {
							return fmt.Errorf("blog with slug %s already exists", ans)
						}
					}
					return nil
				}),
			},
			{
				Name:     "title",
				Prompt:   &survey.Input{Message: "Blog title:"},
				Validate: survey.Required,
			},
			{
				Name:   "description",
				Prompt: &survey.Input{Message: "Blog description:"},
			},
		}

		var answers BlogAnswers

		err = survey.Ask(qs, &answers)
		if err != nil {
			fmt.Println(err)
			return
		}

		// Interactive tag management
		tags, err := editTags([]string{})
		if err != nil {
			fmt.Println("Tag editing cancelled or failed:", err)
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
			resp, err := uploadImage(file, answers.Title, "blogs")
			if err != nil {
				fmt.Println("Error uploading image:", err)
				return
			}

			answers.Thumbnail = resp.SecureURL
		} else {
			answers.Thumbnail = thumbnail
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
		if len(tags) > 0 {
			frontmatter["tags"] = tags
		}
		frontmatter["createdAt"] = time.Now().Format(time.RFC3339)
		frontmatter["updatedAt"] = time.Now().Format(time.RFC3339)

		err = writeProjectMDX(frontmatter, answers.Slug, blogDir, answers.Title, answers.Description)
		if err != nil {
			fmt.Println("Error writing MDX file:", err)
			return
		}

		fmt.Printf("Successfully created blog post '%s' in %s/%s.mdx\n", answers.Title, blogDir, answers.Slug)
	},
}

// editTags provides an interactive loop to add/remove tags using survey.
func editTags(existing []string) ([]string, error) {
	tags := append([]string{}, existing...)

	for {
		fmt.Println()
		if len(tags) == 0 {
			fmt.Println("Current tags: (none)")
		} else {
			fmt.Printf("Current tags: %s\n", strings.Join(tags, ", "))
		}

		action := ""
		actionPrompt := &survey.Select{
			Message: "Tag management:",
			Options: []string{"Add tag", "Remove tag", "Finish"},
		}
		if err := survey.AskOne(actionPrompt, &action); err != nil {
			return nil, err
		}

		switch action {
		case "Add tag":
			var newTag string
			input := &survey.Input{
				Message: "Enter tag to add (comma separated for multiple):",
			}
			if err := survey.AskOne(input, &newTag, survey.WithValidator(survey.Required)); err != nil {
				return nil, err
			}
			newTag = strings.TrimSpace(newTag)
			if newTag == "" {
				continue
			}
			newTags := strings.Split(newTag, ",")
			for _, tag := range newTags {
				tag = strings.TrimSpace(tag)
				if tag == "" {
					continue
				}
				if containsIgnoreCase(tags, tag) {
					fmt.Println("Tag already exists, skipping.")
					continue
				}
				tags = append(tags, tag)
			}

		case "Remove tag":
			if len(tags) == 0 {
				fmt.Println("No tags to remove.")
				continue
			}
			var toRemove string
			rmPrompt := &survey.Select{
				Message: "Select tag to remove:",
				Options: tags,
			}
			if err := survey.AskOne(rmPrompt, &toRemove); err != nil {
				return nil, err
			}
			tags = removeIgnoreCase(tags, toRemove)

		case "Finish":
			return tags, nil
		}
	}
}

func containsIgnoreCase(slice []string, s string) bool {
	s = strings.ToLower(s)
	for _, v := range slice {
		if strings.ToLower(v) == s {
			return true
		}
	}
	return false
}

func removeIgnoreCase(slice []string, s string) []string {
	out := []string{}
	s = strings.ToLower(s)
	for _, v := range slice {
		if strings.ToLower(v) != s {
			out = append(out, v)
		}
	}
	return out
}
