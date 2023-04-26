var _ = require("underscore");


function symmetricMarkdownElement(end) {
    return function() {
        return {start: end, end: end};
    };
}

function markdownElement(start, end) {
    return function() {
        return {start: start, end: end};
    };
}

function markdownLink(attributes) {
    var href = attributes.href || "";
    if (href) {
        return {
            start: "[",
            end: "](" + href + ")",
            anchorPosition: "before"
        };
    } else {
        return {};
    }
}

function markdownImage(attributes) {
    var src = attributes.src || "";
    var altText = attributes.alt || "";
    if (src || altText) {
        return {start: "![" + altText + "](" + src + ")"};
    } else {
        return {};
    }
}

function markdownList(options) {
    return function(attributes, list) {
        return {
            start: list ? "\n" : "",
            end: list ? "" : "\n",
            list: {
                isOrdered: options.isOrdered,
                indent: list ? list.indent + 1 : 0,
                count: 0
            }
        };
    };
}

function markdownListItem(attributes, list, listItem) {
    list = list || {indent: 0, isOrdered: false, count: 0};
    list.count++;
    listItem.hasClosed = false;
    
    var bullet = list.isOrdered ? list.count + "." : "-";
    var start = repeatString("\t", list.indent) + bullet + " ";        
    return {
        start: start,
        end: function() {
            if (!listItem.hasClosed) {
                listItem.hasClosed = true;
                return "\n";
            }
        }
    };
}

var htmlToMarkdown = {
    "p": markdownElement("", "\n\n"),
    "br": markdownElement("", "  \n"),
    "ul": markdownList({isOrdered: false}),
    "ol": markdownList({isOrdered: true}),
    "li": markdownListItem,
    "del":symmetricMarkdownElement("~~"),//删除文本
    "strong": symmetricMarkdownElement("__"),//加粗
    "em": symmetricMarkdownElement("*"),//斜体
    "a": markdownLink,
    "img": markdownImage
};

(function() {
    for (var i = 1; i <= 7; i++) {       
        htmlToMarkdown["h" + i] = markdownElement(repeatString("#", i) + " ", "\n\n");
    }
})();

function repeatString(value, count) {
    return new Array(count + 1).join(value);
}

function markdownWriter() {
    var fragments = [];
    var elementStack = [];
    var list = null;
    var listItem = {};
    var fontStyle = [];
    
    function open(tagName, attributes) {
        attributes = attributes || {};
        
        var createElement = htmlToMarkdown[tagName] || function() {
            return {};
        };
        var element = createElement(attributes, list, listItem);
        elementStack.push({end: element.end, list: list});

        if (element.list) {
            list = element.list;
        }
        //如果包含
        let font = undefined
        if(attributes.style){
           let styleArray=attributes.style.split(";")
           let styleObject ={}
           for (let index = 0; index < styleArray.length; index++) {
                const elements = styleArray[index];
                const [key, value] = elements.split(':');
                if (key && value) {
                    styleObject[key.trim()] = value.trim();
                }
           } 
        //    <font  face="黑体" color=green size=5>我是黑体，绿色，尺寸为5</font>
           if(styleObject['font-size']&&parseInt(styleObject['font-size'])>12){
              font=`<font  size=${parseInt(styleObject['font-size'])-12}>`
              if(styleObject['color']){
                font=`<font  size=${parseInt(styleObject['font-size'])-12} color=${styleObject['color']}>`
              }
              fontStyle.push(font)
           }else if(styleObject['color']){
             font=`<font  color=${styleObject['color']}>`
             fontStyle.push(font)
           }

           //斜线
           if (styleObject['text-decoration']) {
            }
            //backColor
            if (styleObject['background-color']) {
            }
        }
      
        var anchorBeforeStart = element.anchorPosition === "before";
        if (anchorBeforeStart) {
            writeAnchor(attributes);
        }
        if(font) {
            fragments.push(font);
        }

        fragments.push(element.start || "");
        if (!anchorBeforeStart) {
            writeAnchor(attributes);
        }
    }
    
    function writeAnchor(attributes) {
        if (attributes.id) {
            fragments.push('<a id="' + attributes.id + '"></a>');
        }
    }
    
    function close(tagName,attributes) {
        var element = elementStack.pop();
        list = element.list;
        var end = _.isFunction(element.end) ? element.end() : element.end;
        fragments.push(end || "");   
        if(fontStyle&&fontStyle.length>=1){
            fontStyle.pop()
            fragments.push('</font>');   
        }  
    }
    
    function selfClosing(tagName, attributes) {
        open(tagName, attributes);
        close(tagName, attributes);
    }
    
    function text(value) {
        fragments.push(escapeMarkdown(value));
    }
    
    function asString() {
        return fragments.join("");
    }

    return {
        asString: asString,
        open: open,
        close: close,
        text: text,
        selfClosing: selfClosing
    };
}

exports.writer = markdownWriter;

function escapeMarkdown(value) {
    return value
        .replace(/\\/g, '\\\\')
        .replace(/([\`\*_\{\}\[\]\(\)\#\+\-\.\!])/g, '\\$1');
}
