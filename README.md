## funnel-nextjs

A example of simple funnel that keeps states even when browser back happened.

[blog(korean)](https://dev.classmethod.jp/articles/funnel_browser_back_safe)

## what is it

Example repository of how to keeps data in funnel steps when back/forwards.

Control history by query params so, remain data when back/forwards.

You can find logics in [src/app/page.tsx](https://github.com/Tolluset/funnel-nextjs/blob/main/src/app/page.tsx).

## how it works


The kept states in parent component so funnels data is kept.

If go back after user complete the funnel, the state is automatically cleared because complete page is controlled by different route. 

The funnel's parent component should make `useEffect` to initaillize the route.


## how to start

```
pnpm install
pnpm dev
```


