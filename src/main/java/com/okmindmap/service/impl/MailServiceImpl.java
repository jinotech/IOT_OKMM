package com.okmindmap.service.impl;

import java.util.List;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSender;

import com.okmindmap.service.MailService;

public class MailServiceImpl implements MailService {

	private JavaMailSender mailSender;
	
	public void setMailSender(JavaMailSender mailSender){
		this.mailSender = mailSender;
	}
	
	@Override
	public void sendMail(String to, String subject, String body) {
		sendMail(new String[]{to}, subject, body);
	}

	@Override
	public void sendMail(String to, String subject, String body, String contentType) {
		sendMail(new String[]{to}, subject, body, contentType);
	}
	
	@Override
	public void sendMail(List<String> to, String subject, String body) {
		sendMail(to.toArray(new String[to.size()]), subject, body);
	}

	@Override
	public void sendMail(String[] to, String subject, String body) {
		MimeMessage message = mailSender.createMimeMessage();

		try {
			InternetAddress addresses[] = new InternetAddress[to.length];
			for(int i = 0; i < to.length; i++) {
				addresses[i] = new InternetAddress(to[i]);
			}
			message.addRecipients(Message.RecipientType.TO, addresses);
			message.setSubject(subject, "UTF-8");
			message.setText(body, "UTF-8");
			
			mailSender.send(message);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
		
	}
	
	@Override
	public void sendMail(String[] to, String subject, String body, String contentType) {
		MimeMessage message = mailSender.createMimeMessage();
		
		try {
			InternetAddress addresses[] = new InternetAddress[to.length];
			for(int i = 0; i < to.length; i++) {
				addresses[i] = new InternetAddress(to[i]);
			}
			message.setContent(body, contentType);
			message.addRecipients(Message.RecipientType.TO, addresses);
			message.setSubject(subject, "UTF-8");
			//message.setText(body, "UTF-8");
			
			mailSender.send(message);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
		
	}

}
