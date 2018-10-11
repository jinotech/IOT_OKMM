var aItemData = [
		{
			text: "<em id=\"homelabel\"><spring:message code='menu.home' /></em>",
			url: "${pageContext.request.contextPath}/"
		},
		{
			text: "<spring:message code='menu.basic' />",
			submenu: {
				id: "basic",
				itemdata: [
					{
						text: "<spring:message code='menu.basic.map' />",
						submenu: {
							id: "basicmapmenu",
							itemdata: [
								[
									{ text: "<spring:message code='menu.mindmap.new'/>", helptext: "Ctrl + N", onclick: { fn: newMap } },
									{ text: "<spring:message code='menu.mindmap.open'/>", helptext: "Ctrl + O", onclick: { fn: openMap } },
									{ text: "<spring:message code='menu.mindmap.timelinemode'/>", onclick: { fn: timelineMode } }
									<c:if test="${data.canEdit}">
									,
									{ text: "<spring:message code='menu.mindmap.save'/>", helptext: "Ctrl + S", onclick: { fn: saveMap } },
									{ text: "<spring:message code='menu.mindmap.saveas'/>", onclick: { fn: saveAsMap } },
									{ text: "<spring:message code='menu.mindmap.newnodemap'/>", onclick: { fn: splitMap } },
									{ text: "<spring:message code='menu.mindmap.delete'/>", onclick: { fn: delMap } }
									<c:if test="${data.isOwner}">
									,
									{ text: "<spring:message code='message.changntitle'/>", onclick: { fn: changeMapName } }
									</c:if>
									</c:if>
								]
	
							]
						}
					}
					<c:if test="${data.canEdit}">
					,
					{
						text: "<spring:message code='menu.basic.creation' />",
						submenu: {
							id: "basiccreationmenu",
							itemdata: [
								[
									{ text: "<spring:message code='menu.edit.childnode'/>", helptext: "Insert", onclick: { fn: insertAction } },
									{ text: "<spring:message code='menu.edit.siblingnode'/>", helptext: "Enter", onclick: { fn: insertSiblingAction } }
								],
								[
									{ text: "<spring:message code='menu.media.image'/>", helptext: "Alt + K", onclick: { fn: imageProviderAction } },									
									{ text: "<spring:message code='menu.media.video'/>", onclick: { fn: videoProviderAction } },
									{ text: "<spring:message code='menu.edit.hyperlink'/>", helptext: "Ctrl + K", onclick: { fn: insertHyperAction } },
									{ text: "<spring:message code='menu.edit.iframe'/>", onclick: { fn: insertIFrameAction } }
									{ text: "<spring:message code='menu.edit.iframe'/>", onclick: { fn: insertWebPageAction } }
									{ text: "<spring:message code='menu.edit.iframe'/>", onclick: { fn: insertLTIAction } }
								]	
							]
						}
					},
					{
						text: "<spring:message code='menu.edit'/>",
						submenu: {
							id: "editmenu",
							itemdata: [
								[
									{ text: "<spring:message code='menu.edit.nodeedit'/>", helptext: "F2", onclick: { fn: editNodeAction } }
								],
								[
									{ text: "<spring:message code='menu.edit.cut'/> ", helptext: "Ctrl + X", onclick: { fn: cutAction } },
									{ text: "<spring:message code='menu.edit.copy'/>", helptext: "Ctrl + C", onclick: { fn: copyAction } },
									{ text: "<spring:message code='menu.edit.paste'/>", helptext: "Ctrl + V", onclick: { fn: pasteAction } }
								],
								[
									{ text: "<spring:message code='menu.format.nodetextcolor'/>", onclick: { fn: nodeTextColorAction } },
									{ text: "<spring:message code='menu.format.nodebgcolor'/>", onclick: { fn: nodeBGColorAction } },
									{ text: "<spring:message code='menu.edit.imageresizer'/>", onclick: { fn: imageResizerAction } },
									{ text: "<spring:message code='menu.media.image.remove'/>", onclick: { fn: imageRemoveAction } },
									{ text: "<spring:message code='menu.edit.videoresizer'/>", onclick: { fn: videoResizerAction } },
									{ text: "<spring:message code='menu.media.video.remove'/>", onclick: { fn: foreignObjRemoveAction } },
									{ text: "<spring:message code='menu.edit.iframe.remove'/>", onclick: { fn: foreignObjRemoveAction } }
								],								
								[
									{ text: "<spring:message code='menu.view.folding'/>", helptext: "Space", onclick: { fn: foldingAction } },
									{ text: "<spring:message code='menu.format.resetcoordinate'/>", onclick: { fn: resetCoordinateAction } }
								],
								/*
								[
									{ text: "<spring:message code='menu.edit.undo'/>", helptext: "Ctrl + Z", onclick: { fn: undoAction } },
									{ text: "<spring:message code='menu.edit.redo'/>", helptext: "Ctrl + Y", onclick: { fn: redoAction } }
								],
								*/
								[
									/*{ text: "<spring:message code='menu.arrowlinkdelete'/>", onclick: { fn: deleteArrowlinkAction } },*/
									{ text: "<spring:message code='menu.edit.delete'/>", helptext: "Del", onclick: { fn: deleteAction } }
								]
						] }
					},
					{
						text: "<spring:message code='menu.view'/>",
						submenu: {
							id: "viewmenu",
							itemdata: [								
								[
									{ text: "<spring:message code='menu.view.zoomin'/>", helptext: "+", onclick: { fn: zoominAction } },
									{ text: "<spring:message code='menu.view.zoomout'/>", helptext: "-", onclick: { fn: zoomoutAction } },
									{ text: "<spring:message code='menu.view.zoomnot'/>", onclick: { fn: zoomnotAction } }
								],
								[
									{ text: "<spring:message code='menu.view.afolding'/>", helptext: "Alt + Home", onclick: { fn: foldingAllAction } },
									{ text: "<spring:message code='menu.view.aunfolding'/>", helptext: "Alt + End", onclick: { fn: unfoldingAllAction } }
								]
						] }
					},
					{
						text: "<spring:message code='menu.search'/>", helptext: "Ctrl + F", onclick: { fn: findNodeAction }
					},
					{
						text: "<spring:message code='menu.okmpreference'/>", onclick: { fn: okmPreference }
					}
					</c:if>
				]
			}
		},
		<c:if test="${data.canEdit}">
		{
			text: "<spring:message code='menu.transformshare'/>",
			submenu: {
				id: "transformsharemenu",
				itemdata: [
					[
						{
							text: "<spring:message code='menu.transformshare.mapshare'/>",
							submenu: {
								id: "configmenu",
								itemdata: [
									{ text: "<spring:message code='menu.setting.group'/>", onclick: { fn: groupManage } },
									{ text: "<spring:message code='menu.setting.share'/>", onclick: { fn: shareManage } }
								]
							}
						},
						{
							text: "<spring:message code='menu.transformshare.snsimport'/>",
							submenu: {
								id: "snsimportmenu",
								itemdata: [
									{ text: "<spring:message code='menu.plugin.facebook'/>", onclick: { fn: FacebookGetFeedAction } },
									{ text: "<spring:message code='menu.plugin.twitter'/>", onclick: { fn: IMPORT_TWITTER_TIMELINE_TRIGGER } },									
									{ text: "<spring:message code='menu.plugin.delicious'/>", onclick: { fn: DeliciousAction } }
								]
							}
						},
						{
							text: "<spring:message code='menu.mindmap.export'/>",
							submenu: {
								id: "export",
								itemdata: [
									{ text: "<spring:message code='common.freemind'/>", onclick: { fn: exportToFreemind } },
									{ text: "<spring:message code='common.qrcode'/>", onclick: { fn: qrCodeAction } },
									{ text: "<spring:message code='etc.html'/>", onclick: { fn: exportToHTML } },
									/* { text: "<spring:message code='etc.twiki'/>", onclick: { fn: exportToTWiki } }, */
									{ text: "<spring:message code='etc.ppt'/>", onclick: { fn: exportToPPT } },
									{ text: "<spring:message code='etc.svg'/>", onclick: { fn: exportToSVG } },
									{ text: "<spring:message code='etc.png'/>", onclick: { fn: exportToPNG } },
									{ text: "<spring:message code='etc.txt'/>", onclick: { fn: exportToText } },
									/*
									{ text: "<spring:message code='etc.doc'/>", onclick: { fn: exportToDoc } },
									{ text: "<spring:message code='etc.hwp'/>", onclick: { fn: exportToHwp } },
									{ text: "<spring:message code='etc.latex'/>", onclick: { fn: exportToLatex } },
									*/
									{ text: "<spring:message code='menu.mindmap.embed'/>", onclick: { fn: createEmbedTag } }
								]
							}
						},
						{
							text: "<spring:message code='menu.mindmap.import'/>",
							submenu: {
								id: "import",
								itemdata: [
									{ text: "<spring:message code='common.freemind'/>", onclick: { fn: importMap } },
									{ text: "<spring:message code='menu.plugin.bookmark'/>", onclick: { fn: importBookmark } }
								]
							}
						}
					]
				]
			}
		},
		{
			text: "<spring:message code='menu.advanced'/>",
			submenu: {
				id: "advancedmenu",
				itemdata: [
					{
						text: "<spring:message code='menu.advanced.mapadvanced'/>",
						submenu: {
							id: "mapadvancedmenu",
							itemdata: [
								[
									{ text: "<spring:message code='menu.view.changemap.mindmap'/>", onclick: { fn: changeToMindmap } },
									{ text: "<spring:message code='menu.view.changemap.tree'/>", onclick: { fn: changeToTree } },
									{ text: "<spring:message code='menu.view.changemap.fishbone'/>", onclick: { fn: changeToFishbone } }
									/* ,									
									{ text: "<spring:message code='menu.view.changemap.table'/>", onclick: { fn: changeToTable } }									
									{ text: "<spring:message code='menu.view.changemap.radial'/>", onclick: { fn: changeToRotate } },
									{ text: "<spring:message code='menu.view.changemap.brain'/>", onclick: { fn: changeToBrain } }
									 */
								],
								[
									{ text: "<spring:message code='menu.plugin.colorchange'/>", helptext: "Ctrl + 1", onclick: { fn: nodeColorMix } }
								],
								[
									{ text: "<spring:message code='menu.mindmap.newnodemap'/>", onclick: { fn: splitMap } }
								],
								[
									{ text: "<spring:message code='menu.plugin.nodelinecolorchange'/>", onclick: { fn: nodeLineColor } }
								]
							]
						}
					},
					{ text: "<spring:message code='menu.advanced.pt'/>", onclick: { fn: presentationEditMode } },
					{ text: "<spring:message code='menu.advanced.googlesearch'/>", onclick: { fn: googleSearch } }
				]
			}
		},
		</c:if>
		{
			text: "<spring:message code='menu.cs'/>",
			submenu: {
				id: "centermenu",
				itemdata: [
					[
						{ text: "<spring:message code='menu.cs.notice'/>", onclick: { fn: notice }, disabled: false },
						{ text: "<spring:message code='menu.cs.qna'/>", onclick: { fn: qna }, disabled: false }
					],
	
					[
						{ text: "<spring:message code='menu.cs.require'/>", onclick: { fn: requestFunction }, disabled: false }
					]
				]
			}
		},
		{
			text: "<spring:message code='menu.help'/>",
			submenu: {
				id: "helpmenu",
				itemdata: [[{
					text: "<spring:message code='menu.help.usage'/>",
					onclick: {
						fn: howtoUse
					},
					disabled: false
				}], [{
					text: "<spring:message code='menu.help.intromindmap'/>",
					onclick: {
						fn: aboutOKMindmap
					},
					disabled: false
				}, {
					text: "<spring:message code='menu.help.introjino'/>",
					onclick: {
						fn: aboutJinoTech
					},
					disabled: false
	
				}]]
			}
		}
	];