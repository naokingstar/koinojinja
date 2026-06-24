function diagnose(){

document.getElementById('result').style.display='block';

const ages=[
'20歳',
'22歳',
'24歳',
'26歳',
'28歳'
];

const mbtis=[
'ENFP',
'INFJ',
'ISFP',
'ENTP',
'INTJ'
];

const personalities=[
'明るく社交的',
'優しく思いやりがある',
'知的で落ち着いている',
'行動力がある',
'誠実で一途'
];

const age=ages[Math.floor(Math.random()*ages.length)];
const mbti=mbtis[Math.floor(Math.random()*mbtis.length)];
const personality=personalities[Math.floor(Math.random()*personalities.length)];

document.getElementById('resultAge').innerText=
'おすすめ年齢：'+age;

document.getElementById('resultMbti').innerText=
'おすすめMBTI：'+mbti;

document.getElementById('resultPersonality').innerText=
'性格：'+personality;

document.getElementById('resultAdvice').innerText=
'恋愛は焦らず自然体で進めると良い結果につながります。';

}
