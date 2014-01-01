
copy:
	rsync --exclude-from .gitignore --exclude .git --delete -av . amkweb@wasp.dreamhost.com:~/allsky.airynothing.com/
