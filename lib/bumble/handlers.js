var Views = require('./views');
var Handlers = function (config, next) {
    this.config = config;
    this.views = new Views(config, next);
};

Handlers.prototype.notFound = function (request, reply) {
    reply.view('404', {status: 404, bodyId: 'fourohfour'}).code(404);
};

Handlers.prototype.tumblrRedirect = function (request, reply) {
    var url = this.views.tumblrRedirect(request.params);
    if (!url) {
        return this.notFound(request, reply);
    }
    return reply().redirect(url).code(301);
};

Handlers.prototype.rss = function (request, reply) {
    reply.view('rss', this.views.rss(), {contentType: 'text/xml'});
};

Handlers.prototype.index = function (request, reply) {
    this.views.blogIndex(request.query.page, request.params.datePart.split('/'), function _gotIndex(realPage, context) {
        if (realPage) {
            return reply().redirect(request.path + '?page=' + realPage);
        }
        if (!context) {
            return this.notFound(request, reply);
        }
        reply.view('index', context);
    }.bind(this));
};

Handlers.prototype.tagIndex = function (request, reply) {
    this.views.tagIndex(request.query.page, request.params.tag, function _gotTagIndex(realPage, context) {
        if (realPage) {
            return reply().redirect(request.path + '?page=' + realPage);
        }
        if (!context) {
            return this.notFound(request, reply);
        }
        reply.view('index', context);
    }.bind(this));
};

Handlers.prototype.authorIndex = function (request, reply) {
    this.views.authorIndex(request.query.page, request.params.authorSlug, function _gotAuthorIndex(realPage, context) {
        if (realPage) {
            return reply().redirect(request.path + '?page=' + realPage);
        }
        if (!context) {
            return this.notFound(request, reply);
        }
        reply.view('index', context);
    }.bind(this));
};

Handlers.prototype.blogPost = function (request, reply) {
    this.views.blogPost(request.params.year, request.params.month, request.params.day, request.params.pslug, function _gotBlogPost(context) {
        if (!context) {
            return this.notFound(request, reply);
        }
        reply.view('post', context);
    }.bind(this));
};

module.exports = Handlers;