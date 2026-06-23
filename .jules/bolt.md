## 2024-05-18 - FlatList Nested in ScrollView Anti-Pattern
**Learning:** Nesting a `<FlatList>` with `scrollEnabled={false}` inside a `<ScrollView>` breaks the internal virtualization of the FlatList. React Native renders all elements of the FlatList immediately because the parent ScrollView forces it to expand to its full height.
**Action:** Always use a single root `<FlatList>` and utilize `ListHeaderComponent` and `ListFooterComponent` for any UI elements that should scroll along with the list.
