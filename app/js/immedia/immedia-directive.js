/*!
 */

'use strict';

/* Directives */

angular.module('immedia', ['immediaControllers','immediaServices'])

  .directive('myImmediaPrescence', function() {
    return {
      restrict: 'AE',
      templateUrl: templateUrl('../immedia_prescence'),
      controller: 'RoomCtrl'
    };
  })

  .directive('myImmediaSendMessage', ['$rootScope','RoomService', function($rootScope, roomService) {
    return {
      restrict: 'AE',
      link: link
    };

    function link($scope, element, attrs) {

      /*
      $scope.$on('ui_message_before_send', function() {
        console.log('xxx message sent!');
      });
      */
      $scope.$on('apiUpdate', function (e, update) {
        switch (update._) {
          // NOTE: This is called both for new outgoing and new incoming messages
          case 'updateNewMessage':
            if (update.message.out) {
              roomService.sendSnapshot({
                peerId: update.message.from_id,
                messageId: update.message.id,
                date: update.message.date
              });
            }
            break;
        }
      });

      // Detect empty messages and add a dummy text to get Telegram to send anyway
      $scope.$on('ui_message_before_send', function(scope) {
        if($scope.draftMessage.text == "") {
          $scope.draftMessage.text = '-';
        };
      });

      // This gives the temporary ID only
      // broadcasted from services.js L1796 before the message is sent
      /*
      $scope.$on('history_append', function(e, data) {
        console.log('xxx history_append: ' + data.messageID);
      });
      */
    }
  }])

  .directive('myImmediaMessagePicture', ['RoomService', function(roomService) {
    return {
      link: link
    };

    function link($scope, element, attrs) {
      var imgEl = $('<img class="' + (attrs.imgClass || '') + '">')

      $scope.$watch('historyMessage.id', updatePicture);
      $scope.$on('message', updatePicture);

      function updatePicture() {
        var msgId2 = $scope.$eval('historyMessage.from_id + \':\' + historyMessage.date');
        console.log('XXXX rendering message in list msgId2: ' + msgId2);
        imgEl.remove();
        imgEl.prependTo(element).attr('src', roomService.getImageUrl(msgId2));
      };
    };

  }]);
