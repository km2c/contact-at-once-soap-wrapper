$('body').on('submit', '.get-info', function(e) {
    e.preventDefault();
    var form = $(this);
    var input = form.find('input');
    var loc = form.find('select')[0].value;
    var data = {
        provider: {
            Id: input[0].value,
            UserName: input[1].value,
            Password: input[2].value
        },
        filter: {
            StartDate: new Date(input[3].value).toISOString(),
            EndDate: new Date(input[4].value).toISOString()
        }
    };
    form
        .find('button')
        .attr('disabled', 'disabled')
        .html('Working <span class="fa fa-circle-o-notch fa-spin"></span>');
    $.ajax({
        url: '/' + loc,
        data: data,
        type: 'POST'
    }).then(function(data) {
        form
            .find('button')
            .removeAttr('disabled')
            .html('Submit');
        window.open('/public/csv/' + loc + '.csv');
    });
});
