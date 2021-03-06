/* global io */
'use strict';

angular.module('chatApp')
    .factory('socket', function(socketFactory, Auth, Conversation, $mdDialog, $location) {

        var socket;

        function createSocket(id, cb) {

            // socket.io now auto-configures its connection when we ommit a connection url
            var ioSocket = io('', {
                // Send auth token on connection, you will need to DI the Auth service above
                'query': 'token=' + Auth.getToken(),
                'force new connection': true,
                path: '/socket.io-client'
            });

            socket = socketFactory({
                ioSocket: ioSocket
            });


            socket.on('force:disconnect', function() {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('You\'ve been logged out.')
                    .textContent('Your account logged in from another machine.')
                    .ariaLabel('Logout dialog')
                    .ok('Got it!')
                );
                socket.emit('force:disconnect');
                Auth.logout();
                $location.path('/');
            });

            socket.emit('room', id);

            socket.on('message:received', function(from, msg, groupId) {

                if (!!groupId) {
                    var group = _.find(Auth.getCurrentUser().groups, {
                        _id: groupId
                    });

                    if (group) {
                        group.messages.push(msg);
                        group.lastUpdated = Date.now();
                        group.notification = true;
                    }
                } else {
                    var conversation = _.find(Auth.getCurrentUser().conversations, function(conversation) {

                        var hasUser = _.find(conversation.members, {
                            _id: from
                        });

                        if (hasUser) {
                            conversation.messages.push(msg);
                            conversation.members[0].lastUpdated = Date.now();
                            conversation.members[0].notification = true;
                            return true;
                        }
                    });

                    if (!conversation) {
                        Conversation.addToUser({
                            id: Auth.getCurrentUser()._id
                        }, {
                            users: [Auth.getCurrentUser()._id, from]
                        }, function() {
                            socket.emit('conversation:new', from);
                        }, function(err) {
                            console.log(err);
                        });
                    }
                }
            });

            //join groups' rooms
            _.forEach(Auth.getCurrentUser().groups, function(group) {
                socket.emit('group', group._id);
            });

            socket.on('connect', function() {
                cb();
            });
        }

        return {
            socket: socket,

            createSocket: createSocket,

            addedParticipants: function(id, participants) {
                participants.forEach(function(participant) {
                    socket.emit('group:added', id, participant);
                });
            },

            createRoom: function(id) {
                socket.emit('room', id);
            },

            createGroup: function(id) {
                socket.emit('group', id);
            },

            createConversation: function(user) {
                socket.emit('conversation:new', user);
            },

            deleteConversation: function(user) {
                socket.emit('conversation:delete', user);
            },

            exitGroup: function(groupId) {
                socket.emit('group:exit', groupId);
            },

            kick: function(group, userId) {
                socket.emit('group:kicked', group, userId);
            },

            disconnect: function() {
                socket.disconnect();
            },

            friendRequest: function(to) {
                socket.emit('friendRequest:sent', to);
            },

            friendRequestAccepted: function(user) {
                socket.emit('friendRequest:accepted', user);
            },

            friendRequestRejected: function(user) {
                socket.emit('friendRequest:rejected', user);
            },

            deleteContact: function(user) {
                socket.emit('contact:delete', user);
            },

            sendMessage: function(room, msg, toGroup) {
                socket.emit('message:sent', room, msg, toGroup);
            },

            userUpdate: function(action) {
                if (action === 'img') {
                    socket.emit('user:img');
                } else if (action === 'status') {
                    socket.emit('user:status');
                } else if (action === 'email') {
                    socket.emit('user:email');
                }
            },

            groupUpdate: function(action, groupId) {
                if (action === 'img') {
                    socket.emit('group:img', groupId);
                } else if (action === 'name') {
                    socket.emit('group:name', groupId);
                }
            },
            syncSent: function(array, cb) {
                cb = cb || angular.noop;

                socket.on('sentRequestsUpdated', function(item) {
                    var oldItem = _.find(array, {
                        _id: item._id
                    });
                    var index = array.indexOf(oldItem);
                    var event = 'created';

                    // delete oldItem if it exists
                    // otherwise just add item to the collection
                    if (oldItem) {
                        array.splice(index, 1);
                        event = 'updated';
                    } else {
                        array.push(item);
                    }

                    cb(event, item, array);
                });
            },

            syncPending: function(array, cb) {
                cb = cb || angular.noop;
                socket.on('pendingRequestsUpdated', function(item) {
                    var oldItem = _.find(array, {
                        _id: item._id
                    });
                    var index = array.indexOf(oldItem);
                    var event = 'created';

                    // delete oldItem if it exists
                    // otherwise just add item to the collection
                    if (oldItem) {
                        array.splice(index, 1);
                        event = 'deleted';
                    } else {
                        array.push(item);
                    }

                    cb(event, item, array);
                });
            },

            syncContacts: function(array, cb) {
                cb = cb || angular.noop;
                socket.on('contactsUpdated', function(item, event) {
                    var oldItem = _.find(array, {
                        _id: item._id
                    });
                    var index = array.indexOf(oldItem);

                    if (event === 'delete') {
                        array.splice(index, 1);
                        event = 'deleted';
                    } else {
                        // replace oldItem if it exists
                        // otherwise just add item to the collection
                        if (oldItem) {
                            array[index] = item;
                            event = 'updated';
                        } else {
                            array.push(item);
                            event = 'created';
                        }
                    }
                    cb(event, item, array);
                });
            },

            syncGroups: function(array, cb) {
                cb = cb || angular.noop;
                socket.on('groupsUpdated', function(item, event) {
                    var oldItem = _.find(array, {
                        _id: item._id
                    });
                    var index = array.indexOf(oldItem);

                    if (event === 'delete') {
                        array.splice(index, 1);
                        event = 'deleted';
                    } else {
                        // replace oldItem if it exists
                        // otherwise just add item to the collection
                        if (oldItem) {
                            array[index] = item;
                            event = 'updated';
                        } else {
                            array.push(item);
                            event = 'created';
                        }
                    }
                    cb(event, item, array);
                });
            },

            syncConversations: function(array, cb) {
                cb = cb || angular.noop;
                socket.on('conversationsUpdated', function(item, event) {
                    var oldItem = _.find(array, {
                        _id: item._id
                    });

                    var index = array.indexOf(oldItem);

                    if (event === 'delete') {
                        array.splice(index, 1);
                        event = 'deleted';
                    } else {
                        // replace oldItem if it exists
                        // otherwise just add item to the collection
                        if (oldItem) {
                            array[index] = item;
                            event = 'updated';
                        } else {
                            array.push(item);
                            event = 'created';
                        }
                    }
                    cb(event, item, array);
                });
            }
        };
    });
