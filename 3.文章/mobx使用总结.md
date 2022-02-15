[TOC]

# 概念和问题

下文介绍中使用的`React`版本为: `17.0.2`, `Mobx`版本为: `4.15.4`, `Mobx-React`版本为: `6.3.1`.

目前在项目中有使用数据流管理框架`Mobx`, 但感觉使用的时候, 很多使用细节都不够注意, 或者一些关键内容比如`action`, `observer`等, 都只是知道要用, 但是不知道为什么要用, 不知道什么情况下需要使用才是最优选择. 这篇文章, 就尝试从自己在`React`项目中使用`Mobx`遇到的一些问题进行归纳总结, 对于一些使用细节尝试做一些原理性的解答.

首先抛出几个问题:

1. 什么情况下需要使用`@observer`?
2. 怎么判断组件中是否使用了`observable state`呢?
3. 为什么要使用`@action`?
4. 异步`Action`要怎么处理, 需要使用`runInAction`吗?
5. 为什么在`React`项目中, 即使没有使用`@action`, 多次改变`Observable`的值也不会造成多次`re-render`呢?

在阅读本文章之前, 可以先行阅读一下`Mobx`的[官方文档](https://mobx.js.org/README.html), 多读几遍官方文档一定会对自己更好的理解`MObx`产生一定帮助. 

首先, 需要先了解几个概念: 

- `Observable State`: 所有设置为`Observable`的可以改变的值.
- `Derivations`: 通过Observable State直接计算得到的值, 比如`@computed`的值.
- `Reactions`: 与`Derivations`类似, 也是基于`Observable State`, 但并不是为了计算某个值, 而是产生一个动作(比如发起一个请求, 改变节点值等).
- `Ation`: 所有修改`Observable State`的动作.

**PS**: 注意这里有所区分, 所有改变`state`的操作都是`Action`, 而`Mobx`中的同名的api在下文中会用`@action`来表示

四个概念之间的关系可以参照下面这张图: 

![Mobx概念关系图](https://pic3.zhimg.com/v2-c7c7bd62ad65055b2137ed78be003ef2_r.jpg)

上面的图很好的解释了四者之间的关系: 

`Action`修改`State`, `State`的改变会更新`Derivations`和`Reactions`, 同时`Derivations`的改变也会触发`Reactions`. 

其实比较特殊的是`Derivations`, 可以看到它具有双重的身份, 在`State` -> `Derivations`的关系中, 它是一个观察者`observer`, 在`State`发生变化时, `Derivations`会发生变化; 而在`Derivation` -> `Reactions`的关系中, 它又是一个被观察者`observable`, 当`Derivations`发生变化后, 会触发`Reactions`.

在`Mobx`中, `computed`的值就承担这`Derivations`的角色.

# 动态的依赖更新

先来看一个例子: 

```javascript
class Store {
  @observable firstName = 100;
  @observable lastName = 200;
  @observable nickName: undefined | number = undefined;

  @computed
  get fullName() {
    const fullName = this.firstName + this.lastName;
    console.log("computed fullName: ", fullName);
    return fullName;
  }
  
  @action
  changeFirst = () => {
    this.firstName = Math.random();
  };
  
  @action
  changeNick = () => {
    this.nickName = Math.random();
  };
}

const store = new Store()

const Update = observer(() => {
  console.log("Update render");

  return (
  	<>
    	{store.nickName ? (
        <div>nickName: {store.nickName}</div>
      ) : (
        <div>fullName: {store.fullName}</div>
      )}
			<button onClick={store.changeNick}>改变nickName</button>
			<button onClick={store.changeFirst}>改变firstName</button>
    </>
  )
});
```

初始状态下,`nickName`是0,  `Update`直接依赖`nickName`和`fullName`, 间接依赖项是`firstName`和`lastName`, 依赖关系可以参考下图: 

![](https://pic1.zhimg.com/v2-ea1b50e00420af1e27e0929baae759fc_r.jpg)

但是当我们点击`改变nickName`按钮后,  `nickName`发生了变化, 思考一个问题, 当`nickName`有值后, `Update`组件还会依赖`fullName`吗? 这时如果`firstName`或`lastName`发生变化, `Update`组件会`render`吗?



答案都是`否`.

此时的依赖关系发生了变化.

![](https://pic1.zhimg.com/v2-a988753bb78e577ae5811e5549d0e884_r.jpg)

这就是`Mobx`的动态依赖更新, 它的依赖关系是在**框架运行时计算得到的**, 这样的好处在于, 可以保证`observer`只依赖于它所需要的依赖.

# 懒加载机制

还是上面的那个例子, 当`nickName`为`truth`时, `Update`组件已经不再依赖`fullName`, 那么假如这时候, 我们改变`firstName`或者`lastName`的值, 我们已知这时候`Update`组件已经不再依赖`fullName`, 所以不会因为`firstName`或`lastName`的变化重新`render`, 那这时候`fullName`的值会因为`firstName`或`lastName`的变化重新计算吗? 控制台会按照我们的预期打印出值吗?



答案也是**`否`**. 

这就是Mobx的性能优化的手段之一: 懒加载机制.  

要想了解懒加载的机制, 就要首先了解当一个`Action`发生时, `Mobx`内部发生了什么变化, 关于这部分的具体改变流程, 可以参考[Mobx设计思想与实现](https://zhuanlan.zhihu.com/p/90877876)的`从懒加载到MobX响应机制`部分, 有详细的流程图.

这篇文章里提到了, 把`Mobx`内部的改变过程大致分为了两个阶段: 

> - 冒泡阶段: 即被修改的`observable`去通知它的`observer`修改状态, 这个过程是级联的(或者说是递归发生的). 在冒泡阶段除了修改状态, 实际上并没有发生其他事情
> - 执行阶段: 当冒泡阶段结束, 所有的状态都已经被修改完成后, 开始执行需要的操作

冒泡阶段, [Mobx设计思想与实现](https://zhuanlan.zhihu.com/p/90877876)中有详细的流程图, 这里不再重复, 执行阶段的执行顺序, 这篇文章也有所介绍, 这里引用简单的概括一下, 以初始状态, `nickName`没值的时候举例, 当改变`firstName`时: 

> 在冒泡阶段, `Mobx`会把经过的`Reaction`都放进一个待执行的队列里, 执行阶段就从队列中取出去执行, 但是这里的`Reaction`不包括`computed value`, 所以上面例子中的`fullName`是不会加入队列的. 
>
> 在执行阶段, `Mobx`拿到`observer`的`Update`组件后, 会检查它的依赖, 发现`fullName`还处于`possible change`的状态, 就会先确定`fullName`的值, 然后再确定自己所依赖的值.

那么就涉及到了上面提到的懒加载和依赖动态更新, 因为`computed value`不会在冒泡阶段加入到待执行队列中, 而是通过`Reaction`检查依赖的时候来确认它的值的, 所以, 如果`computed value`没有任何`observer`依赖, 在执行阶段, 就不会有任何`Reaction`执行到它, 它自然也就不会执行了. 

所以当`nickName`是`truth`时, `fullName`不再被`Reactions`依赖的时候, 即使改变了`firstName`或者`lastName`的值,  `fullName`也不会重新计算.

那么我们新增一个方法, 交换`firstName`和`lastName`, 交换后计算得出的`fullName`值不变: 

```javascript
@action
exchangeFirstAndLastInAction = () => {
  const temp = this.firstName;
  this.firstName = this.lastName;
  this.lastName = temp;
};
```

假设这时候, `nickName`是`falsy`, 也就是`Update`还是会直接依赖`fullName`的, 这时候, 触发`exchangeFirstAndLastInAction`方法, `Update`会重新`render`吗? 



答案是**`不会`**, 但这里的`fullName`还是会重新计算一次.

那么假如把这里的`@action`去掉, 是否会发生改变呢? 

这里可以自己思考一下,  **下文会对这个问题做出解答**.

# Action

上面有提到, `Mobx`内部更新的过程分为冒泡阶段和执行阶段, 那为什么`Mobx`要分成两个阶段而不是修改状态立即执行呢?

这其实也是`Mobx`性能优化的一个设计, 上面的例子比较简单, 当触发`changeFirst`方法时, 只对一个`state`值做了修改, 但是当一个方法中有多个`Action`发生时, 如果每次都是立即执行, 那么可能每一个`Action` 都会改变同一个`computed value`, 我们其实需要的只是一个最终值, 但立即执行却产生了很多无用的中间态.

而等到所有的状态更新和`Action`都结束之后再去求值, 就只需要最终执行一次求出结果即可, 这其实就是一个批处理.

这时候就需要引入`Mobx`中的另外一个概念: [`transition`](https://mobx.js.org/api.html#transaction).  

`transition`是一个批处理的底层API, 是用来做批量更新的, 在`transition`的事务结束前, 不会通知任何的观察者.

`transition`被引入的目的就是为了标注出一次完整的更新冒泡阶段的开始和结束. 

官方文档上有一个例子, 看一下就会明白它的作用: 

```javascript
import {observable, transaction, autorun} from "mobx";

const numbers = observable([]);

autorun(() => console.log(numbers.length, "numbers!"));
// 输出: '0 numbers!'

transaction(() => {
    transaction(() => {
        numbers.push(1);
        numbers.push(2);
    });
    numbers.push(3);
});
// 输出: '3 numbers!'

```

在平时开发中, 我们基本不会用到`transition`,也不推荐使用,  但我们比较熟悉的`@action`, 就是`transition`的上层封装, 那么我们来把上面的例子做个修改补充, 看下具体的情况: 

```javascript
class Store {
  @observable firstName = 100;
  @observable lastName = 200;

  @computed
  get fullName() {
    const fullName = this.firstName + this.lastName;
    console.log("computed fullName: ", fullName);
    return fullName;
  }

  changeFirstAndLastWithoutAction = () => {
    this.firstName = Math.random();
    this.lastName = Math.random();
  };
  
  @action
  changeFirstAndLastWithAction = () => {
    this.firstName = Math.random();
    this.lastName = Math.random();
  };
}

const store = new Store();

// 当依赖的observable state值发生改变时, autorun会再次触发
autorun(() => console.log("autorun中打印fullName: ", store.fullName));

const Update = observer(() => {
  console.log("Update render");
    return (
      <div>
        fullName: {store.fullName}
        <button onClick={store.changeFirstAndLastWithoutAction}>
          不在action中改变firstName和lastName
        </button>
        <button onClick={store.changeFirstAndLastWithAction}>
          action中改变firstName和lastName
        </button>
      </div>
    );
  }
});
```

当点击`changeFirstAndLastWithoutAction`方法时, 我们同步改变了`firstName`和`lastName`的值, 但这个方法没有使用`action`,  这个时候, 控制台会打印什么内容呢? 

然后点击`changeFirstAndLastWithAction`方法, 同步改变了`firstName`和`lastName`的值, 这个方法使用了`action`, 这个时候控制台会打印什么内容呢? 与没有使用`action`的方法有区别吗? 

**这里建议先自己思考一下, 在看下面的结果**.



首先是, 点击`changeFirstNameAndLastNameWithoutAction`方法时, 没有`action`的情况下, 看下输出: 

```javascript
// computed fullName:  0.9666486941396348
// autorun fullName 0.9666486941396348
// computed fullName:  0.9796278940563887
// autorun fullName 0.9796278940563887
// Update render 
```

然后是点击`changeFirstNameAndLastNameWithAction`方法, 这个方法使用了`action`, 看下输出: 

```javascript
// computed fullName:  0.46508722412398207
// autorun fullName 0.46508722412398207
// Update render 
```

根据输出的结果, 可以看出, 虽然都是同步改变了`firstName`和`lastName`的值, 但是打印的内容却有差异,  `computed`和`autorun`里的内容在没有使用`action`的情况下都执行了两遍, 而在存在`action`的情况下, 却只打印了一遍.

这也是`Mobx`的最佳实践里, 建议对`observable state`的修改都加上`@action`的原因, 加上了`action`, 就可以理解为是做了批处理, 所以并不会每修改一个`state`就立即去执行改变后的值, 而是先经历`冒泡`阶段, 改变`state`/`Derivation`/`Reaction`的状态, 然后等到`action`中的内容运行结束之后, 才会去执行改变后的值, 这样才算是一次完整的更新.

官方文档上介绍`action`的时候, 有一句话也代表着相同含义:  

> action期间, 生成的中间值或未完成的值对应用的其余部分是不可见的.

而没有加`action`的情况, 就可以理解为修改了某个`observable state`之后立即执行.

但在这里, 细心的同学可能发现了, 为什么`autorun`中的内容执行了两边, `computed fullName`也打印了两个不同的结果,  而`React`的`Update`组件却只打印了一遍`render`呢? 

这个问题暂时打个问号, 大家也不妨自己结合`React`思考一下是为什么, **这边文章的后半部分会对这个问题做出解答**.



现在, 就可以回答上面的那个问题了, 当交换`firstName`和`lastName`的方法, 去掉了`@action`,  输出的结果应该是: 

```javascript
exchangeFirstAndLastInAction = () => {
  const temp = this.firstName;
  this.firstName = this.lastName;
  this.lastName = temp;
};

// computed fullName:  0.2032942583568902
// autorun fullName 0.2032942583568902
// computed fullName:  0.46508722412398207
// autorun fullName 0.46508722412398207
// Update render 
```

可见, 虽然最终`fullName`的值是不变的, 但没有`@action`的批处理, 还是会引起两次`autorun`的执行和一次`Update`的重新`render`. 

# 异步改变state的值

前面有提到`action` 的作用, 就是类似于批处理的一个行为, 通过这样的处理, `Mobx`能判断何时所有的`state`变更都已经结束, 也正是因为这点, `Mobx`的最佳实践里推荐大家都使用`action`.  

但是对于异步的处理, `action`就显得力不从心了, 比如下面的例子:  

```javascript
class Store {
  @observable firstName = "jack";
  @observable lastName = "ma";
  @observable age = (Math.random() * 100).toFixed(2);
  @observable money = (Math.random() * 1000000).toFixed(2);

  @computed
  get fullText() {
    return this.firstName + " " + this.lastName + "的年纪是" + this.age + ", 拥有财富" + this.money;
  }

  @action
  asyncChangeNameWithoutRunInAction = () => {
    this.firstName = Math.random().toFixed(3);
    this.lastName = Math.random().toFixed(3);
    setTimeout(() => {
      this.age = (Math.random() * 100).toFixed(2);
      this.money = (Math.random() * 1000000).toFixed(2);
    }, 0);
  };
}

const store = new Store();

autorun(() => console.log("autorun: ", store.fullText));

const AsyncUpdate = observer(() => {
  console.log("render");

  return (
    <div>
      <div>{store.fullText}</div>
      <div>
        <button onClick={store.asyncChangeNameWithoutRunInAction}>
          异步改变所有值(无runInAction)
        </button>
      </div>
    </div>
  );
});
```

还是通过打印的内容来看运行机制, 当我们点击了`异步改变所有值(无runInAction)`按钮时, 控制台会打印什么呢? 

可以**先自己思考一下**, 这时候`autorun`会运行几次, `AsyncUpdate`会`render`几次? 为什么?



打印结果如下: 

```javascript
// autorun:  0.544 0.477的年纪是3.80, 拥有财富185706.89 
// render 
// autorun:  0.544 0.477的年纪是65.80, 拥有财富185706.89 
// render 
// autorun:  0.544 0.477的年纪是65.80, 拥有财富876883.29 
// render 
```

异步之前改变的`state`, 被`action`正确的处理了, 两次改变, 只引起了一次`autorun`和`render`, 而异步的两次改变, 却引起了两次`autorun`和`render`.  

虽然从表面上看, `setTimeout`内的改变还是在`action`的覆盖范围之内, 但其实了解浏览器的事件循环机制我们就知道, 异步的回调函数在运行时和同步的`asyncChangeNameWithoutRunInAction`方法已经不在一个函数栈里了, 这也就意味着超出了`action`的处理范围.

这时候有[多种处理方式](https://mobx.js.org/actions.html#asynchronous-actions), 这里以`runInAction`举例:  

```javascript
@action
asyncChangeNameInAction = () => {
  this.firstName = Math.random().toFixed(3);
  this.lastName = Math.random().toFixed(3);
  setTimeout(() => {
    runInAction(() => {
      this.age = (Math.random() * 100).toFixed(2);
      this.money = (Math.random() * 1000000).toFixed(2);
    });
  }, 0);
};
```

这时候触发`asyncChangeNameInAction`方法, 控制台打印的内容是: 

```javascript
// autorun:  0.347 0.578的年纪是65.80, 拥有财富876883.29 
// render 
// autorun:  0.347 0.578的年纪是38.58, 拥有财富829080.36 
// render 
```

异步前后, 虽然都改变了两次`state`, 但是分别都只引起了一次`autorun`和`render`.

# 什么情况下需要使用`@observer`

首先说明一下, 下文提到的`@observer`和`observer`都是指`mobx-react`中的`observer`API.

引用[官方文档-最佳实践](https://www.mobxjs.com/best/pitfalls.html#use-observer-on-all-components-that-render-observable-s)的一句话: 

> `observer` only enhances the component you are decorating, not the components called by it. So usually all your components should be wrapped by `observer`. Don't worry, this is not inefficient. On the contrary, more `observer` components make rendering more efficient as updates become more fine-grained.

翻译一下就是: 

> `@observer`只会增强你正在装饰的组件, 而不会增强该组件内部调用的组件. 所以, 通常情况下, 你的组件都应该使用`@observer`装饰. 不用担心, 这不是低效的, 相反, `observer`组件越多, 渲染效率越高.

所以, 应该在所有使用了`@observable state`的组件上使用`@observer`, 无论外层是否已经使用. 

`@observer`允许组件独立于其父组件进行渲染, 所以这也意味着, 你使用的`@observer`越多, 你的性能就越好, 而`@observer`本身的开销是可以忽略不计的; 而且对于使用了`observable state`但却没有使用`@observer`的组件, 还可能会产生不及预期的效果, 导致bug.

看下面的代码: 

```javascript
class Store {
  @observable first = 100;
  @observable last = 200;
  @observable numArr = [1, 2, 3];

  @computed
  get total() {
    return this.first + this.last;
  }

  @action
  changeFirst = () => {
    this.first = Math.random();
  };

  @action
  changeLast = () => {
    this.last = Math.random();
  };
  
  @action
  addNumToArr = () => {
    this.numArr.push(Math.random());
  };

  @action
  removeNumOfArr = () => {
    this.numArr.pop();
  };
}

const store = new Store();

interface ChildProps {
  arr: number[];
}

@observer
class Child1 extends React.Component<ChildProps> {
  render() {
    console.log("child1 render");
    return (
      <div>
        <div>child1 - with - observer {store.last}</div>
        <div>
          {this.props.arr.map((item, index) => (
            <span key={index}>{item} - </span>
          ))}
        </div>
      </div>
    );
  }
}

class Child2 extends React.Component<ChildProps> {
  render() {
    console.log("child2 render");
    return (
      <div>
        <div>child1 - without - observer {store.last}</div>
        <div>
          {this.props.arr.map((item, index) => (
            <span key={index}>{item} - </span>
          ))}
        </div>
      </div>
    );
  }
}

// class Child3 extends React.Component {
//   render() {
//     return (
//       <div>
//         <div>child1 - without - observer {store.last}</div>
//         <div>
//           {store.numArr.map((item, index) => (
//             <span key={index}>{item} - </span>
//           ))}
//         </div>
//       </div>
//     );
//   }
// }

const Parent = observer(() => {
  console.log("parent render");
  const arr = store.numArr;

  return (
    <div>
      first: {store.first}
      <Child1 arr={arr} />
      <Child2 arr={arr} />
      // <Child3 />
      <div>
        <button onClick={store.changeFirst}>改变first</button>
        <button onClick={store.changeLast}>改变last</button>
        <button onClick={store.addNumToArr}>数组增加内容</button>
        <button onClick={store.removeNumOfArr}>删除数组最后一项</button>
      </div>
    </div>
  );
});
```

`Child1`和`Parent`是`@observer`的, `Child2`没有使用`@observer`.   

可以思考下, 当点击`改变first`按钮之后, 应该输出什么内容?  点击`改变last`按钮之后, 应该输出什么内容? 



当点击`改变first`按钮, 输出内容为: 

```javascript
// parent render 
// child2 render 
```

可以发现, 改变了`first`, 导致父组件重新渲染, 而父组件重新渲染的时候, 并没有引起`Child1`的重新渲染.  

这是为什么呢? 可以自己独立思考一下, **下文会做解释说明**. 

当点击`改变last`按钮之后, 输出的内容为: 

```javascript
// child1 render 
```

只有`Child1`组件重新渲染了, 因为`Parent`组件不依赖于改变了的`store.last`, 所以这次渲染是独立于`Parent`组件的, 这就是上面说的"`@observer`允许组件独立于其父组件进行渲染"的具体体现.

## 不使用`@observer`造成的问题

还是上面的例子, 如果我们点击了`数组增加内容`或`删除数组最后一项`按钮 会发现, 只有`Child1`中动态渲染除了最新的内容, 而`Child2`和`Child3`却没有实时的渲染出我们修改后的数组.

这里注意看, `Child2`和`Child3`使用`observalbe`数据的方式是不同的, `Child2`是通过父组件传递的`observable`数据, 而`Child3`是直接从`store`中读取的`observable`数据, 但这两者都代表着在组件中使用了`observable`数据.

所以, 两者在没有使用`@observer`的情况下的表现是一致的, 都不会因为`store.numArr`的改变而改变.

这里借用官方文档的描述就是: 

> So if observable objects / arrays / maps are passed to child components, those have to be wrapped with `observer` as well. This is also true for any callback based components.

那怎么解决这个问题呢? 

最简单的方法, 就是`Child2`和`Child3`两个组件都改成`@observer`组件.

针对`Child2`组件, 还可以把`arr`数组转换成`plain data`进行传递.

```javascript
<Child2 arr={toJS(arr)} />
```

> If you want to pass observables to a component that isn't an `observer`, either because it is a third-party component, or because you want to keep that component MobX agnostic, you will have to [convert the observables to plain JavaScript values or structures](https://mobx.js.org/observable-state.html#converting-observables-back-to-vanilla-javascript-collections) before passing them on.

 切记, 如果你实在不想把组件标记为`@observer`,  那么请确定你只指传递了`plain data`.

## 怎么判断`observable state`是否在组件内使用了呢?

在上面的例子中, 不知道大家是否发现一个问题, 当我点击了`数组增加内容`或`删除数组最后一项`按钮, 增删了`store.numArr`这个`observable`的值的时候, 为什么`Parent`组件中明明使用到了`store.numArr`的值, 但是却没有引起`Parent`的重新渲染呢?

这样看来, 从`Mobx`的角度来说, `Parent`组件内并没有使用`store.numArr`数据, 那应该怎么判断`observable state`是否在组件内使用了呢?

官方文档中有这样两段话, 个人感觉可以很好的解释这个问题: 

> `observer` works best if you pass object references around as long as possible, and only read their properties inside the `observer` based components that are going to render them into the DOM / low-level components. **In other words, `observer` reacts to the fact that you 'dereference' a value from an object.**
>
> Components wrapped with `observer` *only* subscribe to observables used during their *own* rendering of the component. 

下面一段话的意思就是使用了`@observer`的组件只会订阅在组件`rendering`期间使用到的`observable`数据, 对于`React`组件来说, 就是函数组件的重新渲染和`class component`的`render()`方法. 

那怎么判断是否使用了呢? 

加粗的那句话是重点, 当你从一个`observable`数据中, 解引用, 使用某个具体的值的时候, 就认为是在该组件中使用到了`observable`数据.

现在让我们尝试把`Parent`组件做一个修改: 

```javascript
const Parent = observer(() => {
  console.log("parent render");
  const arr = store.numArr;
  console.log(arr[0])
	// 下面内容都不变
});
```

这样, 当我们改变了`store.numArr`时, `Parent`组件就会重新渲染了.

也正因为如此, 再传递`observable`数据的时候, 解引用的时机, 越晚越晚, 这点是与`react-redux`不同的.

## `@observer`是怎么做优化的

`observer`高阶组件/装饰器的作用就是将`React`组件转化成响应式组件, 它是由`mobx-react`包提供的,  但这里需要注意, `mobx-react`只有`v6`及以上版本才支持基于`hooks`的组件.

### `Function Component`

当对`Function Component`使用`observer`时, 会自动给对应的组件应用[`React.memo`](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo)方法.

### `Class Component`

当对`Class Component`使用`observer`时, `this.state`和`this.props`都会变成`observable`的, 所以组件会对`render`方法中使用到的`props`和`state`的所有改变都做出响应. 

并且, 当对`Class Component`使用`observer`时, 是不支持[`shouComponentUpdate`](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)方法的, 如果使用了, 控制台会有警告. 所以, 这里推荐使用[`React.PureComponent`](https://zh-hans.reactjs.org/docs/react-api.html#reactpurecomponent), 如果使用的不是`React.PureComponent`而是`React.Component` , 那么`Mobx-React`会按照`React.PureComponent`的内容实现自动给组件打上补丁.

到这里就可以清楚了, 为什么上面点击`改变first`按钮之后`Parent`组件重新渲染了, 而被`observer`包裹的`Child1`组件没有重新渲染呢, 就是因为`observer`对`Class Component`组件做的类似于`React.PureComponent`的处理.

## `Callback Component`的处理

这里需要注意, 对于`callback component`中使用到的`observable`数据需要使用`<Observer>`组件包裹, 才能是响应式的.

```react
const TodoView = observer(({ todo }: { todo: Todo }) => {
	// WRONG: 因为onRender不是observer的, 所以当todo.title发生改变时, 并不能在GridRow组件中有所体现
    return <GridRow onRender={() => <td>{todo.title}</td>} />

    // 正确的做法: 使用<Observer>组件包裹callback component
    return <GridRow onRender={() => <Observer>{() => <td>{todo.title}</td>}</Observer>} />
})
```

# 为什么在`React`项目中, 即使没有使用`@action`, 多次改变`Observable`的值也不会造成多次`re-render`呢?

文章开头提到的5个问题, 前四个都已经在前文解答了, 现在我们来解答最后一个问题.

这个问题也可以换一种方式问, 为什么`autorun`中的内容都多次运行, 但是`React`组件却没有多次`re-render`呢?

以`legacy mode `为例, 我们都知道, 当我们在组件的生命周期或者事件回调中使用`this.setStates`或者`useState`触发状态更新时, 不能够实时的拿到更新后的`state`的值,  而背后的原因就是`React`将同一上下文中触发的更新合并为了一个更新, 也就是[批处理](https://jishuin.proginn.com/p/763bfbd5f754). 

而`@action`也可以理解为是类似于`ReactDOM.unstable_batchedUpdates`的批处理机制, 所以上面的例子, 当在`React`的事件回调中触发了一系列同步的`observalble`值的修改时, 即使没有使用`@action`, 也会做优化处理.

但其实这个问题本身就存在问题, 并不是所有没有使用`@action`的多次改变`observable`值的情况都不会造成组件的多次`re-render`, 这种情况仅存在于`React`替我们做了批处理的情况下. 如果在异步代码中或者原生事件处理中(`window.addEventListener`)做了上述操作, `React`的表现与`autorun`的表现是一致的.

**PS**: `blocking mode`和`concurrent mode`的批处理方式与`legacy mode`不同, 具体区别可以参考[Feature Comparison](https://reactjs.org/docs/concurrent-mode-adoption.html#feature-comparison). 

更详细的说明可以参考这条[issue](https://github.com/mobxjs/mobx-react/issues/505), 但是这条issue中有一个问题, 看的时候需要注意: 

> Simply put `async` functions are unbatchable by both mobx/react (can change in the future).

这点在文章使用的版本里面已经支持了.

# Tips

1. 上文所有代码示例, 都可以从[codesandbox](https://codesandbox.io/s/mobxce-shi-yojgn?file=/src/modules/AsyncUpdate/store.ts)去直接模拟.
2. 使用[`trace()`](https://mobx.js.org/analyzing-reactivity.html)方法可以帮助你很好的进行调试.
3. 多看几遍[Understanding reactivity](https://mobx.js.org/understanding-reactivity.html), 有助于帮助自己了解`Mobx`的运行原理.
4. 如果你的组件没有按照你的预期重新渲染, 尝试从[这里](https://mobx.js.org/react-integration.html#troubleshooting)找一下问题.
5. Mobx不会跟踪[异步访问的数据](https://mobx.js.org/understanding-reactivity.html#mobx-does-not-track-asynchronously-accessed-data). 
6. 使用`@action`和`runInAction`还有助于帮助我们调试代码.

**参考文章**: 

1. [Mobx设计思想与实现](https://zhuanlan.zhihu.com/p/90877876)
2. [从Mobx的action探探js的异步](https://zhuanlan.zhihu.com/p/93639733)
3. [mobx-react-issue-505](https://github.com/mobxjs/mobx-react/issues/505)
4. [深入浅出 React ——自动批处理特性](https://jishuin.proginn.com/p/763bfbd5f754)



