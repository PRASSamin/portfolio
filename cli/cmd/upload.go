/*
Copyright 2025 PRAS
*/
package cmd

import (
	"fmt"

	"github.com/AlecAivazis/survey/v2"
	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
)

func init() {
	uploadCmd.Flags().StringP("folder", "f", "images", "Cloudinary subfolder under pras/portfolio/")
	uploadCmd.Flags().StringP("name", "n", "", "Public ID for the uploaded image (without extension)")
	rootCmd.AddCommand(uploadCmd)
}

var uploadCmd = &cobra.Command{
	Use:   "upload",
	Short: "Upload an image to Cloudinary and get the URL",
	Run: func(cmd *cobra.Command, args []string) {
		godotenv.Load()

		folder := cmd.Flag("folder").Value.String()
		name := cmd.Flag("name").Value.String()

		// Browse for the image file
		file, err := askFile(".")
		if err != nil {
			fmt.Println(err)
			return
		}

		// Ask for public ID if not provided via flag
		if name == "" {
			prompt := &survey.Input{Message: "Public ID (name for the image):"}
			if err := survey.AskOne(prompt, &name, survey.WithValidator(survey.Required)); err != nil {
				fmt.Println(err)
				return
			}
		}

		fmt.Printf("Uploading %s to pras/portfolio/%s ...\n", file, folder)

		resp, err := uploadImage(file, name, folder)
		if err != nil {
			fmt.Println("Error uploading image:", err)
			return
		}

		fmt.Println()
		fmt.Println(resp.SecureURL)
	},
}
