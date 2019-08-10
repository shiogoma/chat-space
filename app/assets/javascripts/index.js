$(function() {
  $(document).on('turbolinks:load', function () {

    var search_list = $("#user-search-result");
    var selected_list = $("#chat-group-users");

    function appendUser(user) {
      var html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${ user.name }</p>
                  <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${ user.id }" data-user-name="${ user.name }">追加</div>
                </div>`
      search_list.append(html);
    }

    function appendNoUser(user) {
      var html = `<div class='chat-group-user clearfix'>
                    <p class='chat-group-user__name'>${user}</p>
                  </div>`
      search_list.append(html);
    }

    function appendDeleteUser(user) {
      var html = `<div class='chat-group-user clearfix js-chat-member', id="chat-group-user-${ user.id }">
                  <input name='group[user_ids][]' type='hidden' value='${ user.id }'>
                  <p class='chat-group-user__name'>${ user.name }</p>
                  <a class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn' data-user-id="${ user.id }" data-user-name="${ user.name }">削除</a>
                </div>`
      selected_list.append(html);
    }
  
    $("#user-search-field").on("keyup", function() {
      var input = $("#user-search-field").val();
      if (input !== "") {
        $.ajax({
        type: 'GET',
        url: '/users',
        data: { keyword: input },
        dataType: 'json'
      })

        .done(function(users) {
          $("#user-search-result").empty();
          if (users.length !== 0) {
            users.forEach(function(user){
              appendUser(user);
          });
        } else {
          appendNoUser('一致るするユーザーはありません');
        }
      })
      .fail(function() {
        alert('通信に失敗しました');
        })
      }
    });
    $(document).on("click", ".user-search-add.chat-group-user__btn.chat-group-user__btn--add", function () {
      var user = {};
      user.id = $(this).data("user-id");
      user.name = $(this).data("user-name");
      $(this).parent().remove();
      appendDeleteUser(user);
    })
    
    $(document).on("click", ".chat-group-user__btn--remove", function () {
      $(this).parent().remove();
    })
  });
});