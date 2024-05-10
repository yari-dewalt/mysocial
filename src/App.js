"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AppContext = void 0;
var NavBar_1 = require("./components/NavBar");
var Home_1 = require("./pages/Home");
var Login_1 = require("./pages/Login");
var Signup_1 = require("./pages/Signup");
var Profile_1 = require("./pages/Profile");
var Create_1 = require("./pages/Create");
var Search_1 = require("./pages/Search");
var Messages_1 = require("./pages/Messages");
var Post_1 = require("./pages/Post");
var Connections_1 = require("./pages/Connections");
var Notifications_1 = require("./pages/Notifications");
var react_top_loading_bar_1 = require("react-top-loading-bar");
var socket_1 = require("./socket");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
exports.AppContext = (0, react_1.createContext)({
    user: null,
    handleUser: function () { },
    setLoadingProgress: function () { }
});
function App() {
    var _this = this;
    var _a = (0, react_1.useState)(JSON.parse(localStorage.getItem("user"))), user = _a[0], setUser = _a[1];
    var _b = (0, react_1.useState)(0), loadingProgress = _b[0], setLoadingProgress = _b[1];
    function handleUser(newUserData) {
        setUser(newUserData);
        localStorage.setItem("user", JSON.stringify(newUserData));
    }
    (0, react_1.useEffect)(function () {
        // Function to fetch profile data when component mounts
        var fetchProfileData = function (userId) { return __awaiter(_this, void 0, void 0, function () {
            var response, content, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("https://mysocial-backend.onrender.com/users/".concat(userId), {
                                method: "GET",
                                credentials: "include",
                                headers: { "Content-Type": "application/json" }
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch profile data");
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        content = _a.sent();
                        setUser(content);
                        localStorage.setItem("user", JSON.stringify(content));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        socket_1.socket.connect(); // Connect
        // Check if user is stored in localStorage
        var storedUser = localStorage.getItem("user");
        if (storedUser) {
            var parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Fetch profile data using stored user's ID
            if (parsedUser != null) {
                fetchProfileData(parsedUser._id);
                socket_1.socket.emit("assign id", parsedUser._id);
            }
        }
        else {
            // No stored user, set user to null
            setUser(null);
        }
        return function () {
            socket_1.socket.disconnect();
        };
    }, []); // Empty dependency array to run effect only once
    return (<exports.AppContext.Provider value={{ user: user, handleUser: handleUser, setLoadingProgress: setLoadingProgress }}>
      <div className="flex min-h-screen phone:flex-col-reverse bg-neutral-200">
        <react_router_dom_1.BrowserRouter>
          <react_top_loading_bar_1["default"] color="linear-gradient(90deg, rgba(197,0,255,1) 40%, rgba(246,255,0,1) 100%)" progress={loadingProgress} onLoaderFinished={function () { return setLoadingProgress(0); }} waitingTime={500}/>
          {user && <NavBar_1["default"] />}
          <react_router_dom_1.Routes>
            <react_router_dom_1.Route path="/" element={user ? <Home_1["default"] /> : <react_router_dom_1.Navigate to="/login"/>}/>
            <react_router_dom_1.Route path="/users/:userId" element={user ? <Profile_1["default"] /> : <react_router_dom_1.Navigate to="/login"/>}/>
            <react_router_dom_1.Route path="/users/:userId/connections" element={user ? <Connections_1["default"] /> : <react_router_dom_1.Navigate to="/login"/>}/>
            <react_router_dom_1.Route path="/posts/:postId" element={user ? <Post_1["default"] /> : <react_router_dom_1.Navigate to="/login"/>}/>
            <react_router_dom_1.Route path="/search" element={user ? <Search_1["default"] /> : <react_router_dom_1.Navigate to="/login"/>}/>
            <react_router_dom_1.Route path="/messages" element={user ? <Messages_1["default"] /> : <react_router_dom_1.Navigate to="/login"/>}/>
            <react_router_dom_1.Route path="/messages/:conversationId" element={user ? <Messages_1["default"] /> : <react_router_dom_1.Navigate to="/login"/>}/>
            <react_router_dom_1.Route path="/notifications" element={user ? <Notifications_1["default"] /> : <react_router_dom_1.Navigate to="/login"/>}/>
            <react_router_dom_1.Route path="/create" element={user ? <Create_1["default"] /> : <react_router_dom_1.Navigate to="/login"/>}/>
            <react_router_dom_1.Route path="/login" element={!user ? <Login_1["default"] /> : <react_router_dom_1.Navigate to="/"/>}/>
            <react_router_dom_1.Route path="/signup" element={!user ? <Signup_1["default"] /> : <react_router_dom_1.Navigate to="/"/>}/>
          </react_router_dom_1.Routes>
        </react_router_dom_1.BrowserRouter>
      </div>
    </exports.AppContext.Provider>);
}
exports["default"] = App;
