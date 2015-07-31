<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">
	<xsl:template match="/books/book[@id='murphy_smalzer']">
		<ul>
			<div style="width:100%">
				<b>
					<span>
						book
						<xsl:value-of select="@id" />
					</span>
				</b>
				<xsl:for-each select="unit">
					<div style="width:100%">
						<b>
							<span>
								&#160;&#160;
								unit
								<xsl:value-of select="@id" />
							</span>
						</b>
						<xsl:for-each select="section">
							<div style="width:100%">
								<b>
									&#160;&#160;&#160;&#160;
									<span>
										section
										<xsl:value-of select="@id" />
									</span>
								</b>
								<table style="width:100%">
									<xsl:for-each select="block">
										<tr>
											<td style="width:90%">
												<xsl:value-of select="eng" />
											</td>
											<td style="width:10%">
												<audio style="width:300px">
													<xsl:attribute name="controls" />
													<xsl:attribute name="loop" />
													<source type="audio/mpeg">
														<xsl:attribute name="src">
    		  											<xsl:value-of select="snd" />
										    		</xsl:attribute>
													</source>
												</audio>
											</td>
										</tr>
									</xsl:for-each>
								</table>
							</div>
						</xsl:for-each>
					</div>
				</xsl:for-each>
			</div>
		</ul>
	</xsl:template>
</xsl:stylesheet> 
