/**
 * @file Language for sequencing data (mostly notes) and generating audio
 * @author Magyari Krisztián <magyarikrisztianbusiness@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "l00pr2",
  extras: $ => [
    /\s/,
    $.comment
  ],

  conflicts: $ => [
    [$.note, $.maybe_labeled_node],
    [$.key_value_pair],
    [$.parenthesisless_paramlist],
    [$.play_command, $.node],
    [$.interpolation, $.numerical_expr],
    [$.key_value_pair, $.numerical_expr],
    [$.numerical_expr_no_subtraction, $.numerical_expr],
    [$.numerical_expr_no_subtraction, $.numerical_expr, $.pitch],
  ],

  rules: {
    start: $ => repeat($.statement),

    statement: $ => seq($.expr, ';'),

    expr: $ => choice(
      $.declaration,
      $.command,
      $.binding,
      $.ext_import,
      $.ext_forced_import,
      $.ext_export,
      $.requirement,
      $.unknown_expr
    ),

    // --- Declarations ---
    declaration: $ => seq('declare', $.declared),

    declared: $ => choice(
      $.source_decl,
      $.var_decl,
      $.filter_decl,
      $.note_decl,
      $.sequence_decl,
      $.automation_decl,
      $.unknown_decl
    ),

    source_decl: $ => seq(
      'source',
      choice(
        $.labeled_source,
        seq('{', $.labeled_source, repeat(seq(';', optional($.labeled_source))), '}')
      )
    ),

    source: $ => $.root_non_labeled_tree_node,
    labeled_source: $ => seq($.label, $.source),

    var_decl: $ => seq(
      choice('var', 'variable'),
      $.identifier,
      '=',
      $.numerical_expr
    ),

    note_decl: $ => seq(
      'playable',
      choice(
        $.labeled_note,
        seq('{', $.labeled_note, repeat(seq(';', optional($.labeled_note))), '}')
      )
    ),

    labeled_note: $ => seq($.label, $.note),

    note: $ => choice(
      seq($.node, optional($.sequence)),
      $.parenthesisless_paramlist,
    ),

    sequence_decl: $ => seq(
      'sequence',
      choice(
        $.labeled_sequence,
        seq('{', $.labeled_sequence, repeat(seq(';', optional($.labeled_sequence))), '}')
      )
    ),

    automation_decl: $ => seq(
      'automation',
      choice(
        $.labeled_sequence,
        seq('{', $.labeled_sequence, repeat(seq(';', optional($.labeled_sequence))), '}')
      )
    ),

    labeled_sequence: $ => seq($.label, $.sequence),

    sequence: $ => seq('{', repeat($.timed_note), '}'),

    timed_note: $ => seq(
      '<',
      choice('&', '+', $.numerical_expr),
      ':',
      $.note,
      '>'
    ),

    filter_decl: $ => seq(
      'filter',
      $.label,
      $.paramdecl_list,
      $.root_non_labeled_tree_node
    ),

    paramdecl_list: $ => seq(
      '(',
      $.paramdecl_element,
      repeat(seq(',', $.paramdecl_element)),
      ')'
    ),

    paramdecl_element: $ => choice(
      seq($.identifier, '=', $.param),
      seq('const', $.identifier, optional(seq('=', $.const_param)))
    ),

    unknown_decl: $ => seq($.identifier, /.*/),

    // --- Expressions & Commands ---
    command: $ => choice($.set_command, $.play_command),

    play_command: $ => seq(
      'play',
      choice(
        field('id_to_play', $.identifier),
        field('note_to_play', $.note),
        field('seq_to_play', $.sequence)
      ),
      ',',
      choice(
        field('on_id', $.identifier),
        field('on_source', $.source)
      )
    ),

    set_command: $ => seq(
      'set',
      $.identifier,
      $.operation,
      $.numerical_expr
    ),

    operation: $ => choice('=', '+=', '-=', '*=', '/='),

    binding: $ => seq(
      'bind',
      $.string,
      ':',
      choice(
        $.command,
        seq('{', $.command, repeat(seq(';', $.command)), optional(';'), '}')
      )
    ),

    requirement: $ => choice(
      seq('require', $.string, optional($.version)),
      seq('require-specific', $.string, $.version)
    ),

    ext_export: $ => seq('export', $.identifier),

    ext_import: $ => seq(
      'import',
      choice(
        field('file', $.string),
        seq(
          $.identifier,
          repeat(seq(',', $.identifier)),
          'from',
          field('file', $.string)
        )
      )
    ),

    ext_forced_import: $ => seq(
      'force_import',
      choice(
        $.string,
        seq(
          $.identifier,
          repeat(seq(',', $.identifier)),
          'from',
          field('file', $.string)
        )
      )
    ),

    unknown_expr: $ => seq($.identifier, /.*/),

    // --- Numerical Expressions (Precedence handling) ---
    numerical_expr: $ => choice(
      prec(7, seq('(', $.numerical_expr, ')')),
      prec(6, seq($.identifier, '(', $.numerical_expr, ')')), // prefix_conversion
      prec.left(5, seq($.numerical_expr, choice($.symbol, $.identifier))), // postfix_conversion
      prec.left(4, seq($.numerical_expr, choice('*', '/'), $.numerical_expr)), // div_or_mul
      prec.left(3, seq($.numerical_expr, choice('+', '-'), $.numerical_expr)), // add_or_sub
      prec(2, $.pitch),
      prec(1, choice($.identifier, $.symbol)), // constant
      prec(1, seq(optional(choice('+', '-')), $.signless_number)) // num
    ),

    numerical_expr_no_subtraction: $ => choice(
      prec(7, seq('(', $.numerical_expr, ')')),
      prec(6, seq($.identifier, '(', $.numerical_expr, ')')), // prefix_conversion
      prec.left(5, seq($.numerical_expr, choice($.symbol, $.identifier))), // postfix_conversion
      prec.left(4, seq($.numerical_expr, choice('*', '/'), $.numerical_expr)), // div_or_mul
      prec.left(3, seq($.numerical_expr, '+', $.numerical_expr)), // add_or_sub
      prec(2, $.pitch),
      prec(1, choice($.identifier, $.symbol)), // constant
      prec(1, seq(optional(choice('+', '-')), $.signless_number)) // num
    ),
    // --- Parameters & Interpolation ---
    param: $ => choice(
      $.numerical_expr,
      $.interpolation,
      $.identifier,
      $.string,
      $.maybe_labeled_tree_node
    ),

    const_param: $ => choice($.numerical_expr, $.pitch),

    key_value_pair: $ => choice(
      seq($.numerical_expr, ':', $.numerical_expr_no_subtraction),
      seq('(', $.numerical_expr, ':', $.numerical_expr_no_subtraction, ')')
    ),

    interpolation: $ => choice(
      seq($.key_value_pair, repeat(seq(prec(4, '-'), $.key_value_pair))),
      seq('(', $.key_value_pair, repeat(seq(prec(4, '-'), $.key_value_pair)), ')')
    ),

    paramlist: $ => seq('(', optional($.parenthesisless_paramlist), ')'),

    parenthesisless_paramlist: $ => seq(
      $.param,
      repeat(seq(',', $.param))
    ),

    // --- Tree Structure ---
    node: $ => seq($.identifier, optional($.paramlist)),

    tree_node: $ => seq(
      $.node,
      optional(seq(
        '{',
        $.tree_node,
        repeat(seq(';', $.tree_node)),
        optional(';'),
        '}'
      ))
    ),

    maybe_labeled_node: $ => seq(optional($.label), $.node),

    root_non_labeled_tree_node: $ => seq($.node, optional($.input_list)),

    maybe_labeled_tree_node: $ => seq($.maybe_labeled_node, optional($.input_list)),

    input_list: $ => seq(
      '{',
      $.maybe_labeled_tree_node,
      repeat(seq(';', $.maybe_labeled_tree_node)),
      optional(';'),
      '}'
    ),

    labeled_node: $ => seq($.label, $.node),

    labeled_tree_node: $ => seq($.labeled_node, optional($.input_list)),

    // --- Tokens ---
    label: $ => seq(':', $.identifier, ':'),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_.]*/,

    pitch: $ => choice(
      token(seq(/[A-G]/, optional(choice('#', 'x', 'b', 'bb')), /[0-9]+/)),
      $.signless_number
    ),

    signless_number: $ => /[0-9]+(\.[0-9]+)?/,

    symbol: $ => /[^a-zA-Z0-9_.,:;(){}\[\]+\-\*\/&\=\s#]/,

    string: $ => /"([^"\\]|\\.)*"/,

    version: $ => /[0-9]+\.[0-9]+\.[0-9]+/,

    comment: $ => choice(
      /\/\/[^\r\n]*/,
      seq("/*", /[^*]*\*+([^\/\*][^*]*\*+)*/, "/")
    ),
  }
});
