# Burger Builder Hooks + Optimizations-Recapped and Completed.

Takeaways:

-   The same as BB, but just created in React Hooks

    -   everything is the same but transformed to become React Hooks

-   `React.memo()` -- Used in `Modal.js`

    -   an HoC
    -   used with React Hooks
    -   If your function component wrapped in React.memo has a useState or useContext Hook in its implementation, it will still rerender when state or context change.
    -   Unlike the shouldComponentUpdate() method on class components, the areEqual function returns true if the props are equal and false if the props are not equal. This is the inverse from shouldComponentUpdate.

-   useCallback()

-   useMemo()

-   useState()

-   useEffect()

    -   can be
        `componentDidMount`: []
        `shouldComponentUpdate`: [deps]
        `componentDidUpdate`: no second arg
        `ComponentWillUnmount`: return () => { clean up code here, React Hooks explains more }

-   useDispatch & useSelector has been used

    -   I'll rather use mapStateToProps, `useSelector()` becomes cumbersome
    -   same goes for mapDispatchToProps, `const dispatch = useDispatch()` is lengthy
    -   comes from `'react-redux'`

-   BurgerBuilder.js is revamped

-   App.js is revamped, not really, i didnt use React.lazy() & Suspense bc I'm laz.

-   All are functional components + react hooks!

-   added custom hook for http

-   Car Services tops this code, though some of the React Hooks, useSelector, useDispatch, etc. is NOT used.

-
