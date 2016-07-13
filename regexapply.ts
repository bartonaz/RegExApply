"use strict";

class RegExApply {
    /////////////////////////////////////////// Private members
    private _regexpStrings: Array<string>;
    private _text: string;
    private _regexps: Array<any>;
    private _matchedStrings: Array<string>;
    private _matchedIndices: Array<number>;
    private _matchDone: boolean;
    /////////////////////////////////////////// Public members
    public messages: Array<string>;

    /////////////////////////////////////////// Getters & Setters
    get regexpStrings (): Array<string> {return this._regexpStrings;}
    set regexpStrings (_strings: Array<string>) {
        this._regexpStrings = _strings;
        this._matchDone = false;
    }
    get text (): string {return this._text;}
    set text (_text: string) {
        this._text = _text;
        this._matchDone = false;
    }
    
    /////////////////////////////////////////// Public methods
    constructor (_regexps?: Array<string> | string, _text?: string) {
        if (_text) this.text = _text ? _text : undefined;
        if (_regexps) {
            if (typeof _regexps === "string") this._regexpStrings = [_regexps];
            else this._regexpStrings = _regexps;
        } else this._regexpStrings = [];
        this._resetOutput();
    };
    /**
     * Extract an array of matched strings
     * @param  {Array<string>} regexps Regular expressions to be used
     * @return {Array<string>}         Array of matched strings
     */
    matchedStrings (): Array<string> {
        if (!this._matchDone) {
            this._findMatchedStrings();
        }
        return this._matchedStrings;
    };
    /**
     * Extract an array of first-last indices of the matched strings
     * @param  {Array<string>} regexps Regular expressions to be used
     * @return {Array<string>}         Array of matched strings
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
    }
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
        // Building the list of regular expressions from string definitions
        this._regexps = [];
        for (var i=0, len=this.regexpStrings.length; i<len; ++i) {
            var reString = this.regexpStrings[i];
            if (reString) {
                try {
                    this._regexps.push( new RegExp(reString, "gm") );
                } catch (e) {
                    this.messages.push("Invalid RegExp string: "+reString);
                    return;
                }
            }
        }
        if (this._regexps.length < 1) return;
        // Running the first regex on the text
        var regexps = this._regexps,
            stringsMatched = [],
            indicesMatched = [],
            stringsRematched = [],
            result_;
        var regexp_0 = regexps[0];
        while (result_ = regexp_0.exec(this._text)) {
            var len: number = result_[0].length,
                iLast: number = regexp_0.lastIndex-1;
            if (len < 1) {
                regexp_0.lastIndex++;
                continue;
            }
            stringsMatched.push(result_[0]);
            indicesMatched.push([ iLast - (len-1), iLast ]);
        };
        // // Matching each matched string against next regexps
        // for (var iR=1, lenR=regexps.length; iR<lenR; ++iR) {
        //     var regexp = regexps[iR];
        //     for (var iS=0, lenS=stringsMatched.length; iS<lenS; ++iS) {
        //         stringsRematched = stringsRematched.concat( stringsMatched[iS].match(regexp) );
        //     }
        //     stringsMatched = stringsRematched.slice();
        //     stringsRematched = [];
        // }

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
