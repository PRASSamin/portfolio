/*
Copyright © 2025 PRAS
*/
package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// blogCmd represents the blog command
var blogCmd = &cobra.Command{
	Use:   "blog",
	Short: "Blog management",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("blog called")
	},
}

func init() {
	rootCmd.AddCommand(blogCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// blogCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// blogCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
