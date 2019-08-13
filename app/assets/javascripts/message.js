$(function () {
  function buildHTML(message){
    var image = (message.image) ? `<img class= "lower-message_image" src=${message.image} >` : "";
    var html = `<div class="message" data-message-id="${message.id}">
                  <div class="upper-message">
                    <div class="upper-message__user-name">
                    ${message.user_name}
                    </div>
                    <div class="upper-message__date">
                    ${message.created_at}
                    </div>
                  </div>
                  <div class="lower-message">
                    <p class="lower-message__content">
                    ${message.content}
                    </p>
                    ${image}
                  </div>
                </div>`   
    return html;
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
      $('.form__submit').click("disabled");
      $('#new_message')[0].reset();   
    })
      
    .fail(function(){
      alert('error');
    })  
    .always(function() {
      $('.form__submit').prop('disabled',false);
    })
  })
  
  var reloadMessages = setInterval(function() {
    if (location.href.match(/\/groups\/\d+\/messages/)){
      $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight }, 'fast');
      var last_message_id = $('.message').last().data('message-id');
      var href = 'api/messages'
      $.ajax({
        url: href,
        type: 'get',
        dataType: 'json',
        data: {id: last_message_id}
      })
      .done(function(messages) {
        messages.forEach(function (message) {
          var insertHTML = buildHTML(message);
          $('.messages').append(insertHTML);
          $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight }, 'fast');
        })              
      })
      .fail(function() {
        alert('自動更新に失敗しました');
      });
    } else {
        clearInterval(reloadMessages);
      }
  } , 5000);
 });
 