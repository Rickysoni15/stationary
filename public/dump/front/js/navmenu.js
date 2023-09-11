{/* <script>
$(document).ready(function () {
    $('.hmenu a').click(function () {
        //removing the previous selected menu state
        $('.hmenu').find('li.active').removeClass('active');
        //adding the state for this parent menu
        $(this).parents("li").addClass('active');

    })
});
</script> */}

//   <script>
// $(document).ready(function () {
//   $('#myUL').click(function () {
//     //removing the previous selected menu state
//     $('#myUL').find('li.active').removeClass('active');
//     //adding the state for this parent menu
//     $(this).parents("li").addClass('active');

//   });
// });

// $('#myUL').click(function (e) {
//   e.preventDefault(); //Remove this in your main code
//   $('#myUL').removeClass("active");
//   $(this).addClass("active");
// });


$(document).ready(function () {
    $('a').click(function () {
        //removing the previous selected menu state
        $('.hmenu').find('li.active').removeClass('active');
        //adding the state for this parent menu
        $(this).parents("li").addClass('active');

    });
});

