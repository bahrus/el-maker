# Suggestion for Extending

I like how you made a good call to treat the time-ticker feature as one that probably doesn't belong in an "abstract" class called ElementMaker that serves as general a purpose as element-maker does.  But the explanation provided for separating it out was a bit fuzzy, I think.

The time-ticker package does in fact include both a [custom element feature](https://raw.githubusercontent.com/bahrus/time-ticker/refs/heads/baseline/TimeTicker.js) as well as a [custom element](https://raw.githubusercontent.com/bahrus/time-ticker/refs/heads/baseline/time-ticker-element.js).

I would like to go back to that package, and make the custom element extend ElementMaker from this package so that the static features get "inherited" somehow, and add on the time-ticker package.  I guess there could be a separate file that could be referenced as an old-fashioned module that registers the custom element name, similar to [def.js](https://raw.githubusercontent.com/bahrus/time-ticker/refs/heads/baseline/def.js)

After studying these links carefully, can you spell out what to do below, and I will then copy this file into that project and ask kiro to make the necessary adjustments.