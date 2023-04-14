function removeAccents(str) {
    var AccentsMap = ["aàảãáạăằẳẵắặâầẩẫấậ", "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ", "dđ", "DĐ", "eèẻẽéẹêềểễếệ", "EÈẺẼÉẸÊỀỂỄẾỆ", "iìỉĩíị", "IÌỈĨÍỊ", "oòỏõóọôồổỗốộơờởỡớợ", "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ", "uùủũúụưừửữứự", "UÙỦŨÚỤƯỪỬỮỨỰ", "yỳỷỹýỵ", "YỲỶỸÝỴ"];
    for (var i = 0; i < AccentsMap.length; i++) {
        var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        var char = AccentsMap[i][0];
        str = str.replace(re, char);
    }
    return str;
}

function getSlug(value) {
    return value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

function radomCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

module.exports = { getSlug, radomCode, removeAccents }