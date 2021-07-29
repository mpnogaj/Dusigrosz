const $ = require('jquery');

$('#getProductBtn').on('click', () => {
    const url: string = $('#urlBox').val();
    if(!validateUrl(url)){
        $('#validate').text('Link jest nieprawidłowy');
        return;
    }
    $('#validate').text('');
    getTitle(url);
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

function validateUrl(url: string) : boolean{
    const matches: RegExpMatchArray | null = url.match(/\/\/.*?\//);
    if(matches != null){
        const domain = matches[0].substr(2, matches[0].length - 3);
        if(domain == "www.x-kom.pl") return true;
        return false;
    }
    return false;
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

