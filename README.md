# tree-sitter-l00pr2
l00pr2 tree-sitter parser for syntax higlighting purposes.

## Dependencies:

 - [`nvim-treesitter`](https://github.com/nvim-treesitter/nvim-treesitter)

## Installation:

Put the following lines into your `init.lua`:

```Lua
vim.filetype.add({
    extension = {
        tn = "tune",
        l2 = "l00pr2"
    },
    filetype = {
        ['.tn'] = 'tune',
        ['.l1'] = 'l00pr2'
    }
})

vim.api.nvim_create_autocmd('User', { pattern = 'TSUpdate',
callback = function()
  require('nvim-treesitter.parsers').l00pr2 = {
    install_info = {
      url = 'https://github.com/MKKrisz/tree-sitter-l00pr2',
      generate = true
      generate_from_json = false
      queries = 'queries'
    },
  }
end})

vim.treesitter.language.register('l00pr2', {'tune', 'l00pr2'})

vim.api.nvim_create_autocmd("FileType", {
    pattern = { "tune", "l00pr2" },
    callback = function()
        vim.treesitter.start()
    end,
})
```
