'use strict';

angular.module('proposals').controller('ProposalsController', ['$scope', '$stateParams', '$location', '$animate', '$timeout', 'Authentication', 'Proposals', 'Comments',
	function($scope, $stateParams, $location, $animate, $timeout, Authentication, Proposals, Comments) {
		$scope.authentication = Authentication;

		// Managing the proposal list
		$scope.find = function($scope) {
			$scope.proposals = Proposals.query();
		};

		// Voting / viewing proposal results
		$scope.findOne = function($scope, $routeParams) {

			$scope.proposal = Proposals.get({
				proposalId: $stateParams.proposalId
			});
			$scope.vote = function() {};
		};

		$scope.proposal = {
			question: '',
			choices: [ { text: '' }, { text: '' }, { text: '' }]
		};

		$scope.addChoice = function() {
			$scope.proposal.choices.push({ text: '' });
		};

		$scope.create = function() {
			var proposal = $scope.proposal;
			if(proposal.question.length > 0) {
				var choiceCount = 0;
				for(var i = 0; i < proposal.choices.length; i++) {
					var choice = proposal.choices[i];
					if(choice.text.length > 0) {
						choiceCount++;
					}
				}
				if(choiceCount > 1) {
					var newProposal = new Proposals(proposal);
					newProposal.$save(function(p, resp) {
						if(!p.error) {
							$location.path('proposals');
						} else {
							alert('Could not create proposal');
						}
					});
				} else {
					alert('You must enter at least two choices');
				}
			} else {
				alert('You must enter a question');
			}
		};

		$scope.createVisible = false;
		$scope.switchCreateVisible = function(){
			$scope.createVisible = !$scope.createVisible;
		};


/*

		$scope.switchShowFull = function(repeatScope){
			repeatScope.showFull = !repeatScope.showFull;
		};

		$scope.createVisible = false;
		$scope.switchCreateVisible = function(){
			$scope.createVisible = !$scope.createVisible;
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

		$scope.kismet = function(article, articleScope) {
			if(!article)
			{
				article = $scope.article;
			}
			article.kismet += 1;
			article.$kismet(function() {
				//$location.path('articles/' + article._id);
			}, function(errorResponse) {
				article.kismet -= 1;
				$scope.error = errorResponse.data.message;
				articleScope.showError=true;
				$timeout(function(){
					articleScope.showError=false;
				},2000);
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

*/

	}
]);