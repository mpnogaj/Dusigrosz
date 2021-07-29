const $ = require('jquery');

$('#getProductBtn').on('click', () => {
    console.log($('#urlBox').val());
    getTitle($('#urlBox').val());
});

function getHTML(data: string, openingTag: string, closingTag: string): string {
    const productError = "Couldn't find product name!";
    var re: RegExp = new RegExp(`${openingTag}(.*?)${closingTag}`)
    var matches: RegExpMatchArray | null = data.match(re);
    if (matches == null) {
        return productError;
    }
    const tag: string = matches[0];
    return tag.substring(tag.indexOf('>') + 1, tag.lastIndexOf('<'));
}


function getTitle(url: string) {
    $.ajax({
        url: url,
        async: true,
        success: function (data: string) {
            const nameHtml = getHTML(data, '<div class="sc-1bker4h-10 bdhgIb">', '<\/div>')
            $('#productName').text(nameHtml.substring(nameHtml.indexOf('>') + 1, nameHtml.lastIndexOf('<')));
            $('#productPrice').text(getHTML(data, '<div class="u7xnnm-4 jFbqvs">', '<\/div>'));
            const imagesHtml = getHTML(data, '<span class="sc-1tblmgq-0 jiiyfe-2 ldEQXA sc-1tblmgq-3 fHoITM"', '<\/span>');
            $('#productImage').html(imagesHtml.substring(imagesHtml.lastIndexOf('<'), imagesHtml.lastIndexOf('>') + 1));
        }
    });
}

