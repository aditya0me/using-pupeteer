const puppeteer = require("puppeteer");
var ks = require('node-key-sender');
const browserLaunchPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
    executablePath: "C:\\Users\\Aditya\\AppData\\Local\\Microsoft\\Edge SxS\\Application\\msedge.exe",
    slowMo: 50
});

let cTab;  // this global variable will be object for the first tab 
let globalBrowserInstance; //this global variable will be used for closing the browser when all work will be over

browserLaunchPromise.then(function (browserInstance) {
    globalBrowserInstance=browserInstance;
    let allTabsPromise = browserInstance.pages();
    return allTabsPromise;
})
    .then(function (tabsArr) {
        cTab = tabsArr[0];
        const homePageOpenedPromise = cTab.goto("https://www.indiatoday.in",{
            timeout:0
        });
        return homePageOpenedPromise;
    })
    .then(function () {
        //The following is the code to bring all the top stories article url from the home page of indiatoday.in by using evaluate function
        let allTheTopStoriesURLArrayPromise =cTab.evaluate(function () {
            let ansArr=[];
            document.querySelectorAll("body .top-n-most-popular-stories a")
                .forEach(function (the_a_Tag) {
                    ansArr.push(the_a_Tag.getAttribute("href"));

                });
            return ansArr;
        });
        return allTheTopStoriesURLArrayPromise;
    })
    .then(function(allTheTopStoriesURLArray){
        // console.log(allTheTopStoriesURLArray.length);
        // console.log(allTheTopStoriesURLArray);

        /*
        * In the allTheTopStoriesURLArray, there are some urls (for ex-url to some pages of different sites, or LIVE pages) 
        * that will not work according  to the selectors i am using
        * so I am filtering out those links and storing the valid ones in another array named validTopStories
        */

        let validTopStories = allTheTopStoriesURLArray.filter(function(givenURL){
            if(givenURL.indexOf("https") != -1 || givenURL.indexOf("live") != -1 ){
                //then does not include it, may break the code
                return false;
            }
            else{
                return true;
            }
        }); 

        console.log("Total valid articles count ",validTopStories.length);
        
        //return singleArticleReader("https://www.indiatoday.in/impact-feature/story/oppo-debuts-the-f19-in-india-boasts-the-sleekest-design-with-5000mah-battery-33w-flash-charging-and-more-1788820-2021-04-08");
        
        //first will call for the article at 0th index 
        let oneArticleReadingCompletedPromise = singleArticleReader(  `https://www.indiatoday.in${validTopStories[0]}`  );
        //then will iterate throgh remaining elements in the array
        for(let i=1;i<validTopStories.length;i++){
            oneArticleReadingCompletedPromise = oneArticleReadingCompletedPromise.then(function(){
                return singleArticleReader( `https://www.indiatoday.in${validTopStories[i]}` );
            });
        }
        return oneArticleReadingCompletedPromise;
    })
    .then(function(){
        console.log("All work done. Closing the browser");
        return globalBrowserInstance.close();
    })
    .then(function(){
        console.log("browser closed");
    })
    .catch(function(){
        console.log("some error happened");
    })






/*
    * singleArticleReader is a promised based function, which will take an url as a input,
    * It will open the url, then read that article completely using Read Aloud feature of edge browser
    * After reading it will call the resolve

*/
function singleArticleReader(urlForAnArticle) {

    return new Promise(function (resolve, reject) {
        
        let articlePageOpenedPromise=cTab.goto(urlForAnArticle,{
            timeout:0
        });
        articlePageOpenedPromise.then(function(){
            //console.log("article page loaded");
            /*
                * In the microsoft edge browser, the shortcut for invoking Read Alod feature is  Contrl+Shift+u
                * After loading the article page, we have to hold Control and Shift, then press u 
                * But it did not work, as may be it is issue in puppeteer (similar issue I got posted by anothe developer where he was trying to use three keys simultaneously,the url:-  )
                * Or may be these key cmbination are under control of os, so did not work from the puppeteer function
                * So what i did is, used anothe npm module node-key-sender , that helps to press keys for the os i guess
                * I have used a function of that module below, and the read Aloud feature could be invoked after this 
            */

            return  ks.sendCombination(['control', 'shift', 'u']);
        })
        .then(function(){
            // just waiting for some time to make sure the selector is available, then after it we can wait for the selector to be vanished    
            return cTab.waitForTimeout(1000);
        })                                                               
        .then(function(){
            /*
                * So here is am interesting thing,
                * So in the Read Aloud feature , edge browser adds an span element around the word, in order to indicate which word is being read
                * So I used the class name of that span to indicate that the full article is read, 
                * I used the function waitForSelector to be hidden inorder to achieve the above task
            */

            const waitForSelectorToVanishPromise = cTab.waitForSelector(".node.node-story.view-mode-full .msreadout-word-highlight",{
                hidden:true,
                timeout:0
            });
            return waitForSelectorToVanishPromise;
        })
        // .then(function(){
        //     return cTab.goto("https://www.google.com");
        // })
        .then(function(){
            console.log(`The article ${urlForAnArticle} work is completed`);
            resolve();
        })
        .catch(function(err){
            console.log(err);
            reject()
        })
    });
}

