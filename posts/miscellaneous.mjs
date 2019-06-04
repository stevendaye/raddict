/* Workaround for various codes that did not directly fit in .hbs, .mjs and .js files*/

function dataFeathers(hbs) {
  hbs.registerHelper("feathers", function() {
    var style = "class=\"color\"";
    var result = hbs.handlebars.Utils.escapeExpression(style);
    return new hbs.handlebars.SafeString(
      "<div " + style + ">Comment Buttons</div>"
    );
  });
}

export { dataFeathers };
