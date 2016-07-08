# RegExApply
Simple JavaScript module for applying regular expressions to text with the following features:

* can extract all matched substrings as an array of strings;
* can replace all matched substrings with a new string
   * the new string can reference the matched substring itself, or its position in the array
   * e.g. to enclose the matched string in HTML tags that can be styled with CSS
* multiple regular expressions can be applied recursively;
