var audio={
	'hid':document.getElementById('hid'),
	'oWay':document.getElementById('way'),
	'rot':document.getElementById('rot'),
	'oShow':document.getElementById('show'),
	'big':document.getElementById('big'),
	'mp3':document.getElementById('aud'),
	'song':document.getElementById('song'),
	'singer':document.getElementById('singer'),
	'control':document.getElementById('control'),
	'cur':document.getElementById('cur'),
	'dur':document.getElementById('dur'),
	'sound':document.getElementById('sound'),
	'oSpan':this.control.getElementsByTagName('span'),
	'oDiv':this.control.getElementsByTagName('div'),
	'oSou':this.sound.getElementsByTagName('div'),
	'oList':document.getElementById('list'),
	'off':{s:1,p:1,w:1,n:0,f:0,vol:1,ns:0},
	'step':0,
	//初始化、获取songData歌songData曲数据添加列表
	'init':function(){
		var oUl=this.oList.children[0];
		for (var i=0;i<songData.length;i++ )
		{
			var oLi=document.createElement('li');
			oLi.draggable='true';
			oLi.innerHTML='<div class="song">'+songData[i].song+'</div><div class="singer">'+songData[i].singer+'</div>';
			oUl.appendChild(oLi);
		}
		this.changeText(audio.step);
		this.play();
		this.controlPlay(audio.oDiv[2],audio.oDiv[0],audio.oDiv[1],audio.mp3);
		this.controlSound(audio.oSou[2],audio.oSou[0],audio.oSou[1],audio.mp3);
		this.muted();
		this.autoPlay();
		this.nextPlay();
		this.clickPlay();
		this.controlWord();
		this.playWay();
		this.toggle();
		this.drag();
	},
	//歌曲列表拖拽、调整播放位置
	'drag':function(){
		var This=this;
		var oLi=this.oList.getElementsByTagName('li');
		!function changeAlign(){
			var start;
			for (var i=0;i<oLi.length;i++ )
			{
				oLi[i].index=i;
				oLi[i].ondragstart=function(){
					start=this.index;
				}
				oLi[i].ondragover=function(ev){
					ev=ev||window.event;
					ev.preventDefault();
					for (var i=0;i<oLi.length;i++ )
					{
						oLi[i].style.border='none'
					}
					if(this.index != start){
						this.style.borderBottom = "1px solid rgba(219,112,147,0.7)";
					}
				}
				oLi[i].ondrop=function(ev){
					ev=ev||window.event;
					ev.preventDefault();
					var newArr=arrCopy(songData);
					//改变拖拽位置和songData数组的位置
					if(this.index+1 == oLi.length){//最后添加
						appendAfter(oLi[start],this);
						songData.splice(start,1);
						songData.splice(this.index,0,newArr[start]);
					}else if(this.index == 0){//最前添加
						this.parentNode.insertBefore(oLi[start],this);
						songData.splice(start,1);
						songData.unshift(newArr[start]);
					}else if(start > this.index){//拖拽元素大于目标元素
						appendAfter(oLi[start],oLi[this.index]);
						songData.splice(start,1);
						songData.splice(this.index+1,0,newArr[start]);
					}else{//拖拽元素小于目标元素
						appendAfter(oLi[start],oLi[this.index+1]);
						songData.splice(start,1);
						songData.splice(this.index+1,0,newArr[start]);
					}
					this.style.border='none';
					changeAlign();
				}
			}
		}();
		//复制数组
		function arrCopy(arr){
			var newArr=new Array();
			for(var i=0;i<arr.length;i++){
				newArr[i]=arr[i];
			}
			return newArr;
		}		
		//在obj后添加元素
		function appendAfter(newNode,targetNode){
			var oP=newNode.parentNode;
			if(oP.lastChild==targetNode){
				oP.appendChild(newNode);
			}else{
				oP.insertBefore(newNode,targetNode.nextSibling)
			}
		}
	},
	//toggel播放方式列表
	'toggle':function(){
		var This=this;
		var pNode=this.oWay.parentNode;
		pNode.onmouseover=function(ev){
			ev=ev||window.event;
			ev.preventDefault();
			if(!This.off.f){
				This.hid.style.display='block';
				This.off.f=1;
			}else{
				This.hid.style.display='none';
				This.off.f=0;
			}
		}
		pNode.onmouseout=function(){
			This.hid.style.display='none';
			This.off.f=0;
		}
	},
	//控制Big歌词显示
	'controlWord':function(ev){
		ev=ev||window.event;
		ev.preventDefault();
		this.oSpan[0].onclick=function(){
			if(audio.off.w){
				audio.big.style.display='none';
				audio.off.w=0;
			}else{
				audio.big.style.display='block';
				audio.off.w=1;
			}
		}
	},
	//列表播放
	'clickPlay':function(){
		var This=this;
		var oLi=this.oList.getElementsByTagName('li');
		for (var i=0;i<oLi.length;i++ )
		{
			oLi[i].index=i;
			oLi[i].onclick=function(ev){
				ev=ev||window.event;
				ev.cancelBubble=true;
				clearInterval(This.mp3.timer);
				audio.rot.style.animationPlayState='paused';
				This.dur.innerHTML='00:00:00';
				This.cur.innerHTML='00:00:00';
				This.step=this.index;
				This.changeText(This.step);
				This.mp3.timer=setInterval(This.changeTime,1000);
				if(!This.off.s){
					This.oSpan[2].style.backgroundPosition='-91px -5px';
					This.off.s=1;
				}
			}
		}
		
	},
	//上一曲、下一曲
	'nextPlay':function(){
		var This=this;
		this.oSpan[3].onclick=function(ev){
			ev=ev||window.event;
			ev.preventDefault();
			clearInterval(This.mp3.timer);
			This.autoPlay();
			This.changeTime();
			This.step++;
			if(This.step >= songData.length)This.step=0;
			This.changeText(This.step);
			if(!This.off.s){
				This.oSpan[2].style.backgroundPosition='-91px -5px';
				This.off.s=1;
			}
		}
		this.oSpan[1].onclick=function(ev){
			ev=ev||window.event;
			ev.preventDefault();
			clearInterval(This.mp3.timer);
			This.autoPlay();
			This.changeTime();
			This.step--;
			if(This.step < 0){This.step=songData.length-1};
			This.changeText(This.step);
			if(!This.off.s){
				This.oSpan[2].style.backgroundPosition='-91px -5px';
				This.off.s=1;
			}
		}
	},
	//播放、暂停
	'play':function(){
		var This=this;
		this.oSpan[2].onclick=function(ev){
			ev=ev||window.event;
			ev.preventDefault();
			if(This.off.s){
				this.style.backgroundPosition='-4.5px -5px';
				this.style.transform='rotate(180deg)';
				This.mp3.pause();
				clearInterval(This.mp3.timer);
				This.mp3.addEventListener('pause',function(){
					This.rot.style.animationPlayState='paused';
				});
				This.off.s=0;
			}else{
				this.style.backgroundPosition='-91px -5px';
				This.mp3.play();
				This.mp3.timer=setInterval(This.changeTime,1000);
				This.off.s=1;
			}
		}
	},
	//调整播放进度
	'controlPlay':function(obj,lineC,lineD,vid){
		var This=this;
		//拖拽控制播放条
		obj.onmousedown=function(ev){
			ev=ev||window.event;
			ev.preventDefault();
			var x_=ev.clientX-this.offsetLeft;
			document.onmousemove=function(ev){
				ev=ev||window.event;
				ev.preventDefault();
				var xC=ev.clientX;
				var x=xC-x_;
				if(x < 0){
					x=0;
				}else if(x>(lineC.offsetWidth + lineC.offsetLeft- obj.offsetWidth)){
					x=lineC.offsetWidth + lineC.offsetLeft - obj.offsetWidth;
				}
				obj.style.left=x+'px';
				lineD.style.width=x+'px';
				var num=x/(lineC.offsetWidth - obj.offsetWidth);
				vid.currentTime=num*vid.duration;
				This.changeTime();
			}
			document.onmouseup=function(){
				this.onmousemove=null;
				this.onmouseup=null;
			}
		}
		//点击进度条，控制播放进度
		lineC.onclick=function(ev){
			ev=ev||window.event;
			ev.preventDefault();
			var x=ev.clientX-this.parentNode.offsetLeft;
			obj.style.left=x-this.width+'px';
			lineD.style.width=x+'px';
			var num=x/(this.offsetWidth - obj.offsetWidth/2);
			vid.currentTime=num*vid.duration;
			This.changeTime();
		}
		lineD.onclick=function(ev){
			ev=ev||window.event;
			ev.preventDefault();
			var x=ev.clientX-this.parentNode.offsetLeft;
			obj.style.left=x-this.width+'px';
			lineD.style.width=x+'px';
			var num=x/(lineC.offsetWidth - obj.offsetWidth/2);
			vid.currentTime=num*vid.duration;
			This.changeTime();
		}

	},
	//控制声音
	'controlSound':function(tar,lineC,lineD,vid){
		var This=this;
		tar.onmousedown=function(ev){
			ev=ev||window.event;
			ev.preventDefault();
			var x_=ev.clientX-this.offsetLeft;
			document.onmousemove=function(ev){
				ev=ev||window.event;
				ev.preventDefault();
				var xC=ev.clientX;
				var x=xC-x_;
				if(x <260){
					x=260;
				}else if(x > lineC.offsetWidth+lineC.offsetLeft-tar.offsetWidth){
					x=lineC.offsetWidth+lineC.offsetLeft-tar.offsetWidth;
				}
				tar.style.left=x+'px';
				lineD.style.width=x-260+'px';
				var num=(x-260)/(lineC.offsetWidth-tar.offsetWidth/2);
				vid.volume=num;
				This.off.vol=num;//存储当前的声音值
			}
			document.onmouseup=function(){
				this.onmousemove=null;
				this.onmouseup=null;
			}
		}
	},
	//歌词联动,初始化显示
	'changeText':function(step){
		this.rot.src=songData[step].imgSrc;
		this.mp3.src=songData[step].mp3Src;
		this.song.innerHTML=songData[step].song;
		this.singer.innerHTML=songData[step].singer;
		var g=songData[step].txt.split('[');
		var str='';
		for (var i=0;i<g.length;i++ )
		{
			var arr=g[i].split(']');
			var tArr=arr[0].split('.');
			var t=tArr[0].split(':');
			var time=t[0]*60+parseInt(t[1]);
			var gc=arr[1];
			if(gc){ str +="<p id=s"+time+">"+gc+"</p>"}
			this.oShow.innerHTML=str;
		}
		//歌词联动
		var oP=audio.oShow.getElementsByTagName('p');
		this.mp3.addEventListener('timeupdate',function(){
			var time=parseInt(this.currentTime);
			if(document.getElementById('s'+time)){
				//下面大歌词添加
				audio.big.innerHTML=document.getElementById('s'+time).innerHTML;
				//右侧歌词添加
				for (var i=0;i<oP.length;i++ )
				{
					oP[i].style.color='rgba(119,136,153,0.8)';
					if(oP[i].id =='s'+time){
						document.getElementById('s'+time).style.color='rgba(199,21,133,0.7)';
					}
				}
			}
			//控制歌词滚动
			for (var j=0;j<time;j++)
			{
				audio.oShow.style.marginTop = -(time*2)+"px";
			}
			audio.rot.style.animationPlayState='running';
		});
	},
	//控制静音、静音后恢复之前默认的值
	'muted':function(){
		var This=this;
		spanD=this.sound.children[1];
		spanC=this.sound.children[2];
		var wid=65;
		this.oSpan[4].onclick=function(){
			if(This.off.p){
				This.mp3.muted=true;
				spanD.style.width=0;
				spanC.style.left='260px';
				This.off.p=0;
			}else{
				This.mp3.muted=false;
				spanD.style.width=This.off.vol*wid+'px';
				spanC.style.left=This.off.vol*wid+260+'px';
				This.mp3.volume=This.off.vol;
				This.off.p=1;
			}
		}
	},
	//自动播放、控制播放方式(循环、随机、顺序)
	'autoPlay':function(){
		var This=this;
		this.mp3.timer=setInterval(This.changeTime,1000);
		//监听歌曲结束
		 audio.mp3.addEventListener('ended', function(){  
			clearInterval(This.mp3.timer);
			//图片动画停止
			audio.rot.style.animationPlayState='paused';
			This.dur.innerHTML='00:00:00';
			This.cur.innerHTML='00:00:00';
			//拖拽后，调整step
			for (var i=0;i<songData.length;i++ )
			{
				if(songData[i].song == This.song.innerHTML){
					This.step = i;
					break;
				}
			}
			//判断下一曲播放方式
			switch(This.off.n){
				//顺序播放
				case 0:
					This.step++;
					if(This.step >= songData.length){This.step=0;}
					This.changeText(This.step);
					break;
				//随机播放
				case 1:
					This.changeText(random());
					//取不等于上一首的step
					function random(){
						This.step=Math.floor(Math.random()*songData.length);
						if(This.step != nextStep){
							return This.step;
						}else{
							This.step=Math.floor(Math.random()*songData.length);
						}
					}
					break;
				//单曲循环
				case 2:
					This.changeText(This.step);
					break;
			}
			This.mp3.timer=setInterval(This.changeTime,1000);
		 });
	},
	//返回一个播放方式
	'playWay':function(){
		var This=this;
		var hidLi=this.hid.children;
		for (var i=0;i<hidLi.length;i++)
		{
			hidLi[i].index=i;
			hidLi[i].onclick=function(){
				This.oWay.innerHTML=this.innerHTML;
				This.hid.style.display='none';
				This.off.n=this.index;
				This.off.f=0;
			}
		}
		return this.off.n;
	},
	//联动歌曲时间和播放进度
	'changeTime':function(){
		this.dur.innerHTML=audio.getTime(audio.mp3.duration);
		this.cur.innerHTML=audio.getTime(audio.mp3.currentTime);
		var n=audio.mp3.currentTime/audio.mp3.duration;
		audio.oDiv[2].style.left=n*(audio.oDiv[0].offsetWidth-audio.oDiv[2].offsetWidth)+'px';
		audio.oDiv[1].style.width=n*(audio.oDiv[0].offsetWidth-audio.oDiv[2].offsetWidth)+'px';
	},
	//返回00:00:00格式的时间
	'getTime':function(time){
		time=parseInt(time);
		var hour=this.addzero(Math.floor(time/3600));
		var minute=this.addzero(Math.floor(time%3600/60));
		var second=this.addzero(Math.floor(time%60));
		return hour+':'+minute+':'+second;
	},
	//补零
	'addzero':function(a){
		if(a < 10){
			return '0'+a;
		}else{
			return a+"";
		}
	},
	//通过ID获取元素
	'getDom':function(id){
		return document.getElementById(id);
	}
}