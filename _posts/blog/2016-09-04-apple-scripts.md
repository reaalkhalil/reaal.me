---
title: AppleScripts
category: blog
---

So, I wrote a couple of [AppleScripts](https://en.wikipedia.org/wiki/AppleScript) and connected them to keyboard shortcuts to make my life easier. The first opens a terminal window with the working directory set to the current folder in Finder. The second opens the selected files in MacVim - this is particularly useful for html files.

To set this up, open `Automator` and choose the `Service` option.
![]({{ site.baseurl }}/assets/apple-scripts-1.png)

Then search for `Run AppleScript` in `Actions`.
![]({{ site.baseurl }}/assets/apple-scripts-2.png)
Type in your code and choose the appropriate settings for where the script should run and what inputs it should receive. For the terminal script it should be: Service receives `no input` in `any application`. For the Vim script it should be: Service receives `files or folders` in `Finder`.
![]({{ site.baseurl }}/assets/apple-scripts-3.png)
Save your service. Now open `System Preferences` head to `Keyboard` then `Shortcuts` in the segmented control at the top. Choose `Services` in the left hend list, then scroll to your newly created script.
![]({{ site.baseurl }}/assets/apple-scripts-4.png)
Check the box and assign it a keyboard shortcut.

The script to open a new Terminal window in the current Finder location is:
{% highlight AppleScript %}

tell application "Finder"
  set thisPath to (the POSIX path of (insertion location as alias))
  tell application "Terminal"
    activate
    tell window 1
      do script "cd " & quoted form of thisPath & "; clear"
    end tell
  end tell
end tell

{% endhighlight %}



The script to open selected files in MacVim is:
{% highlight AppleScript %}
on run
  tell application "Finder" to set selectedFiles to selection as alias list
  set openCommand to "/usr/local/bin/mvim"
  repeat with selectedFile in selectedFiles
    set filePath to quoted form of (POSIX path of selectedFile)
    set openCommand to openCommand & " " & filePath
    set thePath to (characters 1 thru -((offset of "/" in (reverse of items of filePath as string)) + 1) of filePath as string) & "'"
  end repeat
  do shell script "cd " & thePath & "; " & openCommand
end run
{% endhighlight %}

Enjoy!
