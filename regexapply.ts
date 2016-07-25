"use strict";

class RegExApply {
    /////////////////////////////////////////// Private members
    private _regexpString: string;
    private _regexpFlags: string;
    private _regexpIsGlobal: boolean;
    private _text: string;
    private _textSearchIndices: Array< Array<number> >;
    private _regexp: any;
    private _matchedStrings: Array<string>;
    private _matchedIndices: Array<Array<number>>;
    private _matchDone: boolean;
    private static _tagDressing: Array<string> = ["@##BRT5K.H1GHLiGHT.PRE##@", "@##BRT5K.H1GHLiGHT.POST##@"];
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
        this._regexpIsGlobal = _flags.indexOf("g") !== -1;
        this._matchDone = false;
    }
    get text (): string {return this._text;}
    set text (_text: string) {
        this._text = _text;
        this._resetSearchIndices();
        this._matchDone = false;
    }
    get textSearchIndices (): Array< Array<number> > {return this._textSearchIndices;}
    set textSearchIndices (_array: Array< Array<number> >) {
        if (_array === undefined) this._resetSearchIndices();
        else this._textSearchIndices = _array;
        this._matchDone = false;
    }
    
    /////////////////////////////////////////// Public methods
    constructor (_regexp?: string, _flags?:string, _text?: string) {
        this._text = _text ? _text : undefined;
        this._regexpString = _regexp ? _regexp : "";
        this._regexpFlags = _flags ? _flags : "";
        this._resetSearchIndices();
        this._resetOutput();
    };
    /**
     * Extract an array of matched strings
     * @param  {Array<string>} regexp Regular expressions to be used
     * @return {Array<string>}        Array of matched strings
     */
    get matchedStrings (): Array<string> {
        if (!this._matchDone) {
            this._findMatchedIndices();
        }
        return this._matchedStrings;
    };
    /**
     * Extract an array of first-last indices of the matched strings
     * @param  {Array<string>} regexp Regular expressions to be used
     * @return {Array<string>}        Array of matched strings
     */
    get matchedIndices (): Array<Array<number>> {
        if (!this._matchDone) {
            this._findMatchedIndices();
        }
        return this._matchedIndices.slice();
    };
    /**
     * Set array of indices explicitly. No actual regexp needed to extract strings or HTML
     * @param {Array<Array<number>>} _indices Indices to be used for substring extraction, etc.
     */
    set matchedIndices (_indices) {
        this._resetOutput();
        this._matchedIndices = _indices;
        this._findMatchedStrings();
        this._matchDone = true;
    }
    /**
     * Text with matched strings surrounded by the configured HTML tags
     * WARNING: it doesn't insert HTML tags for whitespaces. If you're going use it as `innerHTML`, 
     * make sure that the element has the following CSS rule: `white-space: pre-wrap;`
     * @return {string} [description]
     */
    textForHTML (_before?: string, _after?: string): string {
        return RegExApply.highlightedHTMLString(this._text, this.matchedIndices, _before, _after);
    };
    /**
     * Replace matched strings with a new string in the text
     * @param  {string} _replaceStr Replacement string
     * @return {string}             Original text with matched strings being replaced
     */
    textReplaced (_replaceStr: string): string {
        var text = "",
            matchedStrings = this.matchedStrings,
            lastCharIndex = 0;
        // Looping through the matched fragments
        for (var iF=0, nF=this._matchedIndices.length; iF<nF; ++iF) {
            var indices = this._matchedIndices[iF];
            // Adding the original part of the text before the match
            text += this._text.slice(lastCharIndex, indices[0]);
            // Adding the replacement string
            var replacement = _replaceStr;
            // Treating special symbols in the replacement string
            text += replacement;
            lastCharIndex = indices[1];
        }
        text += this._text.slice(lastCharIndex);

        return text;
    };

    /////////////////////////////////////////// Private methods
    /**
     * Find all substrings matching the regexps and assign them to the private member
     */
    _findMatchedIndices (): void {
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
            indicesMatched = [],
            result_;
        // Looping over separate regions of original text
        for (var iR=0, nR=this._textSearchIndices.length; iR<nR; ++iR) {
            var indexOffset = this._textSearchIndices[iR][0],
                lastIndex = this._textSearchIndices[iR][1];
            if (indexOffset < 0) indexOffset += this._text.length;
            if (lastIndex >= 0) lastIndex++;
            var text = this._text.slice(indexOffset, lastIndex);
            // Incrementally executing the RegExp on the region of text
            while (result_ = re.exec(text)) {
                var len: number = result_[0].length,
                    iFirst: number = result_.index;
                if (this._regexpIsGlobal && len < 1) {
                    re.lastIndex++;
                    continue;
                }
                indicesMatched.push([ indexOffset + iFirst, indexOffset + iFirst + len-1 ]);
                if (!this._regexpIsGlobal) break;
            }
        }
        
        this._matchedIndices = indicesMatched;
        this._findMatchedStrings();
        this._matchDone = true;
    };
    /**
     * Extracts substrings based on the found indices
     */
    _findMatchedStrings (): void {
        this._matchedStrings = [];
        for (var iG=0, nG=this._matchedIndices.length; iG<nG; ++iG) {
            var first = this._matchedIndices[iG][0],
                last = this._matchedIndices[iG][1];
            if (first < 0) first += this._text.length;
            if (last >=0) last++;
            this._matchedStrings.push(this._text.slice(first, last));
        }
    }
    /**
     * Reset private output members to initial values
     */
    _resetOutput (): void {
        this._matchedStrings = [];
        this._matchedIndices = [];
        this._matchDone = false;
        this.messages = [];
    };
    /**
     * Reset text search regions to be a single region containing all text
     */
    _resetSearchIndices(): void {
        if (this._text) this._textSearchIndices = [[0, this._text.length]];
    };

    /////////////////////////////////////////// Static class methods
    /**
     * Inserts specified strings before and after text fragments to highlight them
     * @param  {string}               _text    Input text
     * @param  {Array<Array<number>>} _indices Array of pairs of indices of the first and last characters of the fragments
     * @param  {string}               _before  String to be inserted before each fragment
     * @param  {string}               _after   String to be inserted after each fragment
     * @return {string}                        HTML string represting the highlighted text
     */
    static highlightedHTMLString (_text: string, _indices: Array<Array<number>>, _before?: string, _after?: string): string {
        if (_before === undefined && _after === undefined) return _text;
        // Setting the initial indices of points where tags should be inserted
        var insertOffset = 0,
            before = _before.replace(/</g, this._tagDressing[0]+"<"+this._tagDressing[1]).replace(/>/g, this._tagDressing[0]+">"+this._tagDressing[1]),
            after = _after.replace(/</g, this._tagDressing[0]+"<"+this._tagDressing[1]).replace(/>/g, this._tagDressing[0]+">"+this._tagDressing[1]),
            tagLength = { before: before.length, after: after.length },
            text = _text.slice();
        // Inserting the <before> and <after> tags into the string
        for (var iM=0,nM=_indices.length; iM<nM; ++iM) {
            var index = _indices[iM];
            text = [text.slice(0, index[0]+insertOffset), before, text.slice(index[0]+insertOffset)].join('');
            insertOffset += tagLength.before;
            text = [text.slice(0, index[1]+1+insertOffset), after, text.slice(index[1]+1+insertOffset)].join('');
            insertOffset += tagLength.after;
        }
        // Escaping HTML characters
        text = this.escapedString(text);
        text = this.unescapedString(text, this._tagDressing);

        return text;
    };
    /**
     * Join matched strings into a new string with a separation string in between
     * @param  {Array<string>} _strings   Strings to match
     * @param  {string}        _separator Separator inserted between strings
     * @param  {string}        _prefix    Inserted before each string
     * @param  {string}        _postfix   Inserted after each string
     * @return {string}                   Complete joined string
     */
    static matchedStringsJoined (_strings: Array<string>, _separator?: string, _prefix?: string, _postfix?: string): string {
        if (_strings.length < 1) return "";
        var postfix = _postfix === undefined ? "" : this.replacedSpecialChars(_postfix),
            prefix = _prefix === undefined ? "" : this.replacedSpecialChars(_prefix),
            separator = _separator === undefined ? "" : this.replacedSpecialChars(_separator),
            joinStr = postfix+separator+prefix;
            var joinedStr = _strings.join(joinStr);
            joinedStr = prefix+joinedStr+postfix;

            return joinedStr;
    };
    /**
     * String with < and > symbols escaped
     * @param {string} _string Input string
     */
    static escapedString (_string: string): string {
        var str = _string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        return str;
    };
    /**
     * String with dressed &lt; and &gt; symbols unescaped
     * @param {string} _string   Input string
     * @param {string} _dressing String appearing before escaped < and after escaped >
     */
    static unescapedString (_string: string, _dressing: Array<string>): string {
        var dressing = _dressing === undefined || _dressing.length !== 2 ? ["", ""] : _dressing,
            rePre = new RegExp(dressing[0]+"&lt;"+dressing[1], "g"),
            rePost = new RegExp(dressing[0]+"&gt;"+dressing[1], "g");
        
        var str = _string.replace(rePre, "<").replace(rePost, ">");
        // if (dressing === "") str = str.replace(/&amp;/g, "&");

        return str;
    };
    /**
     * Replaces special and escaped characters by normal symbols
     * @param  {string} _string Input string
     */
    static replacedSpecialChars (_string: string): string {
        var str = _string.replace(/\\\\/g, this._tagDressing[0]+"\\"+this._tagDressing[1]);
        str = str.replace(/\\n/g, "\n");
        str = str.replace(/\\t/g, "\t");
        str = str.replace(RegExp(this._tagDressing[0], "g"), "").replace(RegExp(this._tagDressing[1], "g"), "");
        
        return str;
    };
    static unreplacedSpecialChars (_string: string): string {
        var str = _string.replace(/\n/g, "\\n");
        str = str.replace(/\t/g, "\\t");
        
        return str;
    };

}
