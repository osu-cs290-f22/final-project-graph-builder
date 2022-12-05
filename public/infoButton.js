(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['infoButton'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"button-info-container\">\r\n    <button class=\"action-button info-button\">i</button>\r\n    <div class=\"hide text-layout\"><p class=\"info-text\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"infoText") || (depth0 != null ? lookupProperty(depth0,"infoText") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"infoText","hash":{},"data":data,"loc":{"start":{"line":3,"column":55},"end":{"line":3,"column":67}}}) : helper)))
    + "</p></div>\r\n</div>";
},"useData":true});
})();