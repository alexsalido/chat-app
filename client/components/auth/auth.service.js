'use strict';

angular.module('chatApp')
	.factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
		var currentUser = {};
		if ($cookieStore.get('token')) {
			currentUser = User.get();
		}

		return {

			/**
			 * Authenticate user and save token
			 *
			 * @param  {Object}   user     - login info
			 * @param  {Function} callback - optional
			 * @return {Promise}
			 */
			login: function (user, callback) {
				var cb = callback || angular.noop;
				var deferred = $q.defer();

				$http.post('/auth/local', {
					email: user.email,
					password: user.password
				}).
				success(function (data) {
					$cookieStore.put('token', data.token);
					currentUser = User.get();
					deferred.resolve(data);
					return cb();
				}).
				error(function (err) {
					this.logout();
					deferred.reject(err);
					return cb(err);
				}.bind(this));

				return deferred.promise;
			},

			/**
			 * Delete access token and user info
			 *
			 * @param  {Function}
			 */
			logout: function () {
				$cookieStore.remove('token');
				currentUser = {};
			},

			/**
			 * Create a new user
			 *
			 * @param  {Object}   user     - user info
			 * @param  {Function} callback - optional
			 * @return {Promise}
			 */
			createUser: function (user, callback) {
				var cb = callback || angular.noop;

				return User.save(user,
					function (data) {
						$cookieStore.put('token', data.token);
						currentUser = User.get();
						return cb(user);
					},
					function (err) {
						this.logout();
						return cb(err);
					}.bind(this)).$promise;
			},

			/**
			 * Change password
			 *
			 * @param  {String}   oldPassword
			 * @param  {String}   newPassword
			 * @param  {Function} callback    - optional
			 * @return {Promise}
			 */
			changePassword: function (oldPassword, newPassword, callback) {
				var cb = callback || angular.noop;

				return User.changePassword({
					id: currentUser._id
				}, {
					oldPassword: oldPassword,
					newPassword: newPassword
				}, function (res) {
					return cb(res);
				}, function (err) {
					return cb(err);
				}).$promise;
			},

			/**
			 * Change email
			 *
			 * @param  {String}   oldPassword
			 * @param  {String}   newPassword
			 * @param  {Function} callback    - optional
			 * @return {Promise}
			 */
			changeEmail: function (password, newEmail, callback) {
				var cb = callback || angular.noop;

				return User.changeEmail({
					id: currentUser._id
				}, {
					password: password,
					newEmail: newEmail
				}, function (res) {
					return cb(res);
				}, function (err) {
					return cb(err);
				}).$promise;
			},

			/**
			 * Change status
			 *
			 * @param  {String}   status
			 * @param  {Function} callback    - optional
			 * @return {Promise}
			 */
			changeStatus: function (status, callback) {
				var cb = callback || angular.noop;

				return User.changeStatus({
					id: currentUser._id
				}, {
					status: status
				}, function (res) {
					return cb(res);
				}, function (err) {
					return cb(err);
				}).$promise;
			},

			/**
			 * Check if email is registered, returns the user's id if found
			 */
			isRegistered: function (email, callback) {
				var cb = callback || angular.noop;
				var deferred = $q.defer();

				$http.get('/api/users/email/' + email).
				success(function (data) {
					deferred.resolve(data);
					return cb();
				}).
				error(function (err) {
					deferred.reject(err);
					return cb(err);
				});

				return deferred.promise;
			},

			/**
			 * Sends friend request
			 */
			 sendFriendRequest: function (to, callback) {
				 var cb = callback || angular.noop;

 				return User.sendFriendRequest({
 					id: currentUser._id
 				}, {
 					to: to
 				}, function (res) {
 					return cb(res);
 				}, function (err) {
 					return cb(err);
 				}).$promise;
			 },

			/**
			 * Gets all available info on authenticated user
			 *
			 * @return {Object} user
			 */
			getCurrentUser: function () {
				return currentUser;
			},

			/**
			 * Check if a user is logged in
			 *
			 * @return {Boolean}
			 */
			isLoggedIn: function () {
				return currentUser.hasOwnProperty('role');
			},

			/**
			 * Waits for currentUser to resolve before checking if user is logged in
			 */
			isLoggedInAsync: function (cb) {
				if (currentUser.hasOwnProperty('$promise')) {
					currentUser.$promise.then(function () {
						cb(true);
					}).catch(function () {
						cb(false);
					});
				} else if (currentUser.hasOwnProperty('role')) {
					cb(true);
				} else {
					cb(false);
				}
			},

			/**
			 * Check if a user is an admin
			 *
			 * @return {Boolean}
			 */
			isAdmin: function () {
				return currentUser.role === 'admin';
			},

			/**
			 * Get auth token
			 */
			getToken: function () {
				return $cookieStore.get('token');
			}
		};
	});
