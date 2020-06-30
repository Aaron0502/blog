const parseDirDeep = require("./parseDirDeep");
const NullFactory = require("webpack/lib/NullFactory");
const ConstDependency = require("webpack/lib/dependencies/ConstDependency");
const ParserHelpers = require("webpack/lib/ParserHelpers");
const sortByLastEditTime = require("./util");

class ExtractMarkdownDetail {
  // dir
  constructor(definitions) {
    this.definitions = definitions;
    this.blogSet = null;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(
      "ExtractMarkdownDetail",
      async (compilation, { normalModuleFactory }) => {
        const { dir, varName: name } = this.definitions;
        if (this.blogSet) {
        } else {
          this.blogSet = await parseDirDeep(dir);
          sortByLastEditTime(this.blogSet)
        }
        compilation.dependencyFactories.set(ConstDependency, new NullFactory());
        compilation.dependencyTemplates.set(
          ConstDependency,
          new ConstDependency.Template()
        );
        const handler = (parser) => {
          const expression = JSON.stringify(this.blogSet);
          parser.hooks.canRename
            .for(name)
            .tap("ExtractMarkdownDetail", ParserHelpers.approve);
          parser.hooks.expression
            .for(name)
            .tap("ExtractMarkdownDetail", (expr) => {
              ParserHelpers.addParsedVariableToModule(parser, name, expression);
              return true;
            });
        };
        normalModuleFactory.hooks.parser
          .for("javascript/auto")
          .tap("ExtractMarkdownDetail", handler);
        normalModuleFactory.hooks.parser
          .for("javascript/dynamic")
          .tap("ExtractMarkdownDetail", handler);
      }
    );
  }
}

module.exports = ExtractMarkdownDetail;
