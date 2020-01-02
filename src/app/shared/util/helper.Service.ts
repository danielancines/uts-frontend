import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    urlfyText(text: string): string {
        if (!text) return;
        
        let replacePattern1, replacePattern2, replacePattern3, resultText;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        resultText = text.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

        // //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        resultText = resultText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

        // //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        resultText = resultText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

        return resultText;
    }

    htmlfyText(str: string): string {
        if (!str) return;

        var text_input; //store input after beging trim()med
        var output_html = ""; //store output
        var counter;

        text_input = str.trim(); //trim() input
        if (text_input.length > 0) {
            output_html += "<p>"; //begin by creating paragraph
            for (counter = 0; counter < text_input.length; counter++) {
                switch (text_input[counter]) {
                    case '\n':
                        if (text_input[counter + 1] === '\n') {
                            output_html += "</p>\n<p>";
                            counter++;
                        }
                        else output_html += "<br>";
                        break;

                    case ' ':
                        if (text_input[counter - 1] != ' ' && text_input[counter - 1] != '\t')
                            output_html += " ";
                        break;

                    case '\t':
                        if (text_input[counter - 1] != '\t')
                            output_html += " ";
                        break;

                    case '&':
                        output_html += "&amp;";
                        break;

                    case '"':
                        output_html += "&quot;";
                        break;

                    case '>':
                        output_html += "&gt;";
                        break;

                    case '<':
                        output_html += "&lt;";
                        break;

                    default:
                        output_html += text_input[counter];

                }

            }
            output_html += "</p>"; //finally close paragraph
            output_html = this.urlfyText(output_html);
        }
        return output_html;
    }
}