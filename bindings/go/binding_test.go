package tree_sitter_l00pr2_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_l00pr2 "github.com/mkkrisz/l00pr/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_l00pr2.Language())
	if language == nil {
		t.Errorf("Error loading l00pr2 grammar")
	}
}
