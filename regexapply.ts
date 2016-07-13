"use strict";

class RegExApply {
    /////////////////////////////////////////// Private members
    private _regexpString: string;
    private _regexpFlags: string;
    private _text: string;
    private _regexp: any;
    private _matchedStrings: Array<string>;
    private _matchedIndices: Array<number>;
    private _matchDone: boolean;
    /////////////////////////////////////////// Public members
    public messages: Array<string>;

    /////////////////////////////////////////// Getters & Setters
    get regexpString (): string {return this._regexpString;}
    set regexpString (_string: string) {
        this._regexpString = _string;
        this._matchDone = false;
    }
    get regexpFlags (): string {return this._regexpFlags;}
    set regexpFlags (_flags: string) {
        this._regexpFlags = _flags;
        this._matchDone = false;
    }
    get text (): string {return this._text;}
    set text (_text: string) {
        this._text = _text;
        this._matchDone = false;
    }
    
    /////////////////////////////////////////// Public methods
    constructor (_regexp?: string, _text?: string) {
        if (_text) this.text = _text ? _text : undefined;
        if (_regexp) {
            if (typeof _regexp === "string") this._regexpString = _regexp;
            else this._regexpString = _regexp;
        } else this._regexpString = "";
        this._resetOutput();
    };
    /**
     * Extract an array of matched strings
     * @param  {Array<string>} regexp Regular expressions to be used
     * @return {Array<string>}        Array of matched strings
     */
    matchedStrings (): Array<string> {
        if (!this._matchDone) {
            this._findMatchedStrings();
        }
        return this._matchedStrings;
    };
    /**
     * Extract an array of first-last indices of the matched strings
     * @param  {Array<string>} regexp Regular expressions to be used
     * @return {Array<string>}        Array of matched strings
     */
    matchedIndices (): Array<number> {
        if (!this._matchDone) {
            this._findMatchedStrings();
        }
        return this._matchedIndices.slice();
    };
    /**
     * Text with matched strings surrounded by the configured HTML tags
     * WARNING: it doesn't insert HTML tags for whitespaces. If you're going use it as `innerHTML`, 
     * make sure that the element has the following CSS rule: `white-space: pre-wrap;`
     * @return {string} [description]
     */
    textForHTML (before?: string, after?: string): string {
        if (before === undefined && after === undefined) return this._text;
        // Performing the matching if not done yet
        if (!this._matchDone) {
            this._findMatchedStrings();
        }
        // Getting the index ranges of substrings to be enclosed in tags
        var indices = this.matchedIndices(),
            text = this._text,
            insertOffset = 0,
            tagLength = { before: before.length, after: after.length };
        // Inserting the <before> and <after> tags into the string
        for (var iM=0,nM=indices.length; iM<nM; ++iM) {
            // console.log(""+iM+": "+text);
            var index = indices[iM];
            text = [text.slice(0, index[0]+insertOffset), before, text.slice(index[0]+insertOffset)].join('');
            insertOffset += tagLength.before;
            text = [text.slice(0, index[1]+1+insertOffset), after, text.slice(index[1]+1+insertOffset)].join('');
            insertOffset += tagLength.after;
        }

        return text;
    };
    /**
     * Join matched strings into a new string with a separation string in between
     * @param  {string} jointStr Separation string
     * @return {string}          Joined string
     */
    matchedStringsJoined (jointStr: string): string {
        return "matchedJoined"
    };
    /**
     * Replace matched strings with a new string in the text
     * @param  {string} replaceStr Replacement string
     * @return {string}            Original text with matched strings being replaced
     */
    textReplaced (replaceStr: string, tagStr_before: string, tagStr_after: string): string {
        return "replaced";
    };

    /////////////////////////////////////////// Private methods
    /**
     * Find all substrings matching the regexps and assign them to the private member
     */
    _findMatchedStrings (): void {
        this._resetOutput();
        if (!this._regexpString) return;
        try {
            this._regexp = new RegExp(this._regexpString, this._regexpFlags);
        } catch (e) {
            this.messages.push("Invalid RegExp string | flags: "+this._regexpString+" | "+this._regexpFlags);
            return;
        }
        // Running the regexp on the text
        var re = this._regexp,
            stringsMatched = [],
            indicesMatched = [],
            stringsRematched = [],
            result_;
        while (result_ = re.exec(this._text)) {
            var len: number = result_[0].length,
                iLast: number = re.lastIndex-1;
            if (len < 1) {
                re.lastIndex++;
                continue;
            }
            stringsMatched.push(result_[0]);
            indicesMatched.push([ iLast - (len-1), iLast ]);
        };

        this._matchedStrings = stringsMatched;
        this._matchedIndices = indicesMatched;
        this._matchDone = true;
    };
    /**
     * Reset private output members to initial values
     */
    _resetOutput (): void {
        this._matchedStrings = [];
        this._matchedIndices = [];
        this._matchDone = false;
        this.messages = [];
    };
}
