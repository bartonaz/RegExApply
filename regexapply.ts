class RegExApply {
    /////////////////////////////////////////// Private members
    private _regexpStrings: Array<string>;
    private _text: string;
    private _regexps: Array<any>;
    private _matchedStrings: Array<string>;
    private _matchedIndices: Array<number>;
    private _matchDone: boolean;

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
    constructor (_text?: string, _regexps?: Array<string> | string) {
        if (_text) this.text = _text ? _text : undefined;
        if (_regexps) {
            if (typeof _regexps === "string") this._regexpStrings = [_regexps];
            else this._regexpStrings = _regexps;
        } else this._regexpStrings = [];
        this._matchDone = false;
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
        return this._matchedIndices;
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
    _findMatchedStrings(): void {
        this._regexps = [];
        // Building the list of regular expressions to apply
        for (var i=0, len=this.regexpStrings.length; i<len; ++i) {
            if (this.regexpStrings[i]) {
                this._regexps.push( new RegExp(this.regexpStrings[i], "gm") );
            }
        }
        if (this._regexps.length < 1) {
            this._matchedStrings = [];
            this._matchedIndices = [];
            this._matchDone = true;
            return;
        };
        // Running the first regex on the text
        var regexps = this._regexps,
            stringsMatched = [],
            indicesMatched = [],
            stringsRematched = [],
            result_;
            while (result_ = regexps[0].exec(this._text)) {
                console.log("While");
                var len: number = result_[0].length;
                if (len < 1) continue;
                stringsMatched.push(result_[0]);
                indicesMatched.push([ regexps[0].lastIndex - (len-1), regexps[0].lastIndex ]);
            }
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
    }
}
