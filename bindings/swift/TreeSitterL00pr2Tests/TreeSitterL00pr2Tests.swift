import XCTest
import SwiftTreeSitter
import TreeSitterL00pr2

final class TreeSitterL00pr2Tests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_l00pr2())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading l00pr2 grammar")
    }
}
