# Smart eating

'Auto-eat'(the package) doesn't eats when player hp is low, I have to fix this.

- [x] Eat when hp is less than or equal to 20 - 6(14) of health
    - [x] If hunger is equal to or less than 17
    Because at 17 you don't regen life anymore

# On update

Found another bug, if bot hp/hunger is low, it doesn't eat unless one of the two changes, because I'm hooking on their change events.

This may be slower, so you will need something like 'level of intelligence' to dictate what behavior can be done and what not.

- [ ] Check for health/hunger on inventory update
