'use strict';

angular.module('chatApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
	  changeStatus: {
		  method: 'PUT',
		  params: {
			  controller: 'status'
		  }
	  },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
