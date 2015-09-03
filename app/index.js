var superb = require('superb');
var normalizeUrl = require('normalize-url');
var humanizeUrl = require('humanize-url');
var yeoman = require('yeoman-generator');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
	init: function () {
		var self = this;
		var cb = this.async();

		this.prompt([{
			type: "input",
			name: 'moduleName',
			message: 'What do you want to name your module?',
			default: this.appname.replace(/\s/g, '-'),
			filter: function (val) {
				return _s.slugify(val);
			}
		}, {
			type: "input",
			name: 'description',
			message: 'Describe your module.'
		}, {
			name: 'repositoryUrl',
			message: 'What is the repository url?'
		}], function(props) {
			self._runWithProps(props, cb);
		});
	},
	_runWithProps: function (props, cb) {
		var tpl = {
			moduleName: props.moduleName,
			name: this.user.git.name(),
			email: this.user.git.email(),
			repositoryUrl: props.repositoryUrl,
			description: props.description
		};

		var mv = function (src, to) {
			this.fs.move(this.destinationPath(src), this.destinationPath(to));
		}.bind(this);

		this.fs.copyTpl([
			this.templatePath() + '/**'
		], this.destinationPath(), tpl);

		mv('_package.json', 'package.json');
		mv('gitignore', '.gitignore');
		mv('jshintrc', '.jshintrc');
		mv('jshintignore', '.jshintignore');
		mv('license', 'LICENSE');
		mv('readme.md', 'README.md');

		cb();
	}
});
