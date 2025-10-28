

-----

**1. What is the DOM?**
The Document Object Model (DOM) is an object representation of the HTML elements.
• The browser builds the DOM after reading the HTML file the server returns.
• The DOM acts as a bridge between your code and the user interface (UI).
• It has a tree-like structure with parent-child relationships.
• The page's DOM is distinct from the source code (the original HTML file). HTML represents the *initial* page content, while the DOM represents the *updated* page content, which may have been modified by JavaScript code.
• Developers can use DOM methods and JavaScript to manipulate the DOM, allowing them to select, add, update, and remove specific elements in the UI.

**2. What is the difference between Imperative vs. Declarative Programming?**
The difference between imperative and declarative programming centers on whether the developer describes *how* an action should be performed or *what* final result is desired.

| Approach | Description | Pizza Analogy |
| :--- | :--- | :--- |
| **Imperative** | The developer writes detailed steps and instructions on *how* the UI should update. This approach requires writing many instructions. | It's like giving a chef step-by-step instructions on how to make a pizza. |
| **Declarative** | The developer describes *what* they want to be displayed in the UI. The framework or library (like React) handles determining the steps on how to update the DOM on their behalf. | It's like ordering a pizza without worrying about the steps involved in making it. |

React is a popular declarative library used for building user interfaces.

**3. What is JSX, the syntax extension for JavaScript?**
JSX is a syntax extension for JavaScript.
• JSX allows you to describe your UI in a familiar, HTML-like syntax.
• The great thing about JSX is that, other than following three JSX rules, you don't need to learn any new symbols or syntax outside of HTML and JavaScript.
• Browsers do not understand JSX natively.
• To tell React that a variable is JavaScript inside JSX markup, you use curly braces `{}`. The curly braces `{}` are a special JSX syntax that lets you write regular JavaScript directly inside your JSX markup (e.g., object properties, template literals, or function evaluation). Inside these braces, you can add any JavaScript expression that evaluates to a single value.

**4. What is the Babel interpreter?**
Babel is a JavaScript compiler that is needed because browsers do not understand JSX directly.
• Babel's main function is to transform your JSX code into regular JavaScript so the browser can execute it.
• For Babel to know which code it needs to transform, you need to change the script type to `type="text/jsx"`.

**5. What is the difference between props and state?**
Both props and state are fundamental React concepts used to manage and display data. The main difference lies in how they are initialized and where the information flows:

| Characteristic | Props (Properties) | State |
| :--- | :--- | :--- |
| **Definition** | Pieces of information passed *to* React components, similar to HTML attributes. | Any information in your UI that changes over time, usually triggered by user interaction. |
| **Data Flow** | Props are passed from parent components to child components. This concept is known as **one-way data flow**. | State is initiated and stored *within* a component. |
| **Implementation** | They are received in the component as the first function parameter. Props are an object. | It is managed using the React hook called `useState()`. |
| **Relationship** | State information from a parent component can be passed to child components as props. | The logic for updating state should be kept inside the component where it was initially created. State is different from props, which are passed *into* components. |




