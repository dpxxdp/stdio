'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles', 'Comments',
	function($scope, $stateParams, $location, Authentication, Articles, Comments) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});

			article.parent = 'top'; //by default the articles list only shows where parent = 'top'

			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.createComment = function(parentId) {
			var article = new Articles({
				//parent: this.parentId,
				//title: $scope.parentId.toString(),
				content: this.content
			});
			article.title = 'comment';
			article.parent = $scope.article._id; //this.parentId;
			article.$save(function(response) {
				//$location.path('articles/' + response._id);

				//$scope.title = '';
				$scope.content = '';
				$scope.comments.unshift(article); //display the new comment
				$scope.showComment = !$scope.showComment;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//init the comment field to hidden on load
		$scope.showComment = false;
		$scope.showcomment = function(){
			$scope.showComment = !$scope.showComment;
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.kismet = function(article) {
			if(!article)
			{
				article = $scope.article;
			}
			article.kismet += 1;
			article.$kismet(function() {
				//$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.unkismet = function() {
			var article = $scope.article;

			article.kismet -= 1;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
			$scope.comments = //['one','two','three'];
			Comments.query({
				parentId: $stateParams.articleId
			});
		};

	}
]);
