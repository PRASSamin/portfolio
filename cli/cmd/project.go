/*
Copyright © 2025 PRAS
*/
package cmd

import (
	"github.com/spf13/cobra"
)

// projectsCmd represents the projects command
var projectsCmd = &cobra.Command{
	Use:   "project",
	Short: "Manage projects",
}

func init() {
	rootCmd.AddCommand(projectsCmd)
}
