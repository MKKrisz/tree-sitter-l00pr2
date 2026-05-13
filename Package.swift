// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterL00pr2",
    products: [
        .library(name: "TreeSitterL00pr2", targets: ["TreeSitterL00pr2"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.9.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterL00pr2",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterL00pr2Tests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterL00pr2",
            ],
            path: "bindings/swift/TreeSitterL00pr2Tests"
        )
    ],
    cLanguageStandard: .c11
)
