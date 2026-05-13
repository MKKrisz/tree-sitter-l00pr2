"declare" @keyword
"play" @keyword
"set" @keyword
"require" @keyword
"require-specific" @keyword
"bind" @keyword

"import" @keyword.import
"export" @keyword.export
"from" @keyword.import

"source" @keyword.type
"filter" @keyword.type
"playable" @keyword.type
"sequence" @keyword.type
"var" @keyword.type
"variable" @keyword.type
"automation" @keyword.type

(var_decl varname:(identifier) @variable)
(label (":") @punctuation)
(label (identifier) @variable)

(numerical_expr (signless_number) @number.float)
(numerical_expr prefix:(identifier) @function.call)
(numerical_expr postfix:(identifier) @function.call)
(numerical_expr postfix:(symbol) @function.call)
(numerical_expr constant:(symbol) @constant)
(numerical_expr ("+") @operator)
(numerical_expr ("-") @operator)
(numerical_expr ("*") @operator)
(numerical_expr ("/") @operator)
(numerical_expr_no_subtraction (signless_number) @number.float)
(numerical_expr_no_subtraction prefix:(identifier) @function.call)
(numerical_expr_no_subtraction postfix:(identifier) @function.call)
(numerical_expr_no_subtraction postfix:(symbol) @function.call)
(numerical_expr_no_subtraction constant:(symbol) @constant)
(numerical_expr_no_subtraction ("+") @operator)
(numerical_expr_no_subtraction ("-") @operator)
(numerical_expr_no_subtraction ("*") @operator)
(numerical_expr_no_subtraction ("/") @operator)
(pitch) @number
(version) @number

(string)  @string
(comment) @comment

(set_command varname:(identifier) @variable)
(set_command (operation) @operation)

(play_command id_to_play:(identifier) @variable)
(play_command on_id:(identifier) @variable)

(timed_note ("+") @character.special)
(timed_note ("&") @character.special)

(node (identifier) @function.call)

(parenthesisless_paramlist (param (identifier) @variable))
(paramdecl_element (identifier) @variable.parameter)
(paramdecl_element ("const") @keyword.modifier)

";" @punctuation.delimiter
"," @punctuation.delimiter
"{" @punctuation.bracket
"}" @punctuation.bracket
"(" @punctuation.bracket
")" @punctuation.bracket
"<" @punctuation.bracket
">" @punctuation.bracket
(interpolation ("-") @punctuation.delimiter)
(key_value_pair (":") @punctuation.delimiter)
(timed_note (":") @punctuation.delimiter)
